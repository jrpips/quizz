/* *
 *
 *  quizz_v3.js
 *
 * */

var quizz = (typeof (quizz) === 'undefined') ? {

    nb_q: 0,
    conteneur: $('#conteneur'),
    suivant: $('#suivant'),
    precedent: $('#precedent'),
    valider: $('#valider'),
    validation: false,
    tabReponse: new Array(), //collecte les réponses utilisateur
    tabCorrection: new Array(), //[0, 0, 0, 0, 0, 0], //collecte les réponses du quizz

    init: function () {

        $('<span/>').appendTo('#result');

        var $p = $('<p/>', {
            text: 'Quizz de culture générale.'
        });
        var $button = $('<input/>', {
            type: 'button',
            value: 'Commencer',
            id: 'button'
        });
        $p.appendTo(quizz.conteneur);
        $button.appendTo(quizz.conteneur);

        return $button;
    },
    getNbQuestions: function () {

        $.get('php/quizz.php', {action: 'count'}, function (nbQuestions) {
            quizz.nb_q = JSON.parse(nbQuestions);
        })
    },
    constructJauge: function () {

        $('<div/>', {
            id: 'jauge'
        }).appendTo($('#result'));
        
        for (i = 0; i < quizz.nb_q; i++) {
     
            $('<div/>', {
                class: 'echelon',
                id: quizz.nb_q - i
            }).prependTo('#jauge');
        }
        var widthJauge = ((15 + 2 + 5) * quizz.nb_q) + 2;
        widthJauge = widthJauge + 'px';
        //au survol de la jauge...
        $('#jauge').css('width', widthJauge).on('mouseenter', quizz.goTo);
    },
    goTo: function () {

        for (i = 0; i < quizz.nb_q; i++) {
            $('#jauge div').eq(i).on('click', quizz.init_quizz);
        }
    },
    numeroQuestion: function (item) {//gestion du numero de la question à afficher

        var ref = $(item);
        var x = $('label:eq(0)').attr('data-id');
        var y;
        //1.via les boutons < > , valider et les cases de la jauge
        ref = ref.attr('id');

        switch (ref) {
            case 'suivant':
                y = 1;
                break;
            case 'precedent':
                y = -1;
                break;
            case 'valider':
                y = 0;
                break;
            case 'button':
                x = 1;
                y = 0;
                break;
            default:
                y = 0;
                x = ref;
        }
        var numero = parseInt(x) + y;

        //2.limite le numéro entre 1 et le nb max. de questions

        if (numero < 1) {


            numero = quizz.nb_q;
        } else if (numero > quizz.nb_q) {


            numero = 1;
        }
        return numero;
    },
    start_quizz: function (e) {

        quizz.precedent.removeClass('hidden');
        quizz.suivant.removeClass('hidden');
        quizz.valider.removeClass('hidden');
        quizz.init_quizz(e);
    },
    loadAjax: function () {

        if (($('#contentLoader').length) < 1) {


            contentLoader = $('<div/>').attr('id', 'contentLoader').appendTo(quizz.conteneur);

            for (i = 1; i < 6; i++) {

                $('<div/>').attr({'id': 'block_' + i, 'class': 'loader'}).appendTo(contentLoader);
            }
        }
    },
    init_quizz: function (e) {

        var action = e.currentTarget;
        var numero_q = quizz.numeroQuestion(action);

        quizz.loadAjax();

        setTimeout(function () {//test fonction 'loadAjax' (1/2)

            $.ajax({
                type: 'GET',
                url: 'php/quizz.php',
                data: {
                    num_question: numero_q
                },
                dataType: 'json',
                success: function (questions) {

                    quizz.conteneur.empty();

                    quizz.tabCorrection[numero_q] = questions.correct;

                    $('<label/>', {
                        text: questions.question,
                        id: 'first',
                        'data-id': numero_q
                    }).appendTo(conteneur);

                    var num = $('label:eq(0)').attr('data-id');
                    
                    for (var i = 0; i < questions.propositions.length; i++) {

                        $('<br/>').appendTo(quizz.conteneur);
                        $('<label/>', {
                            text: questions.propositions[i]
                        }).appendTo(quizz.conteneur);
                        $('<input/>', {
                            type: 'radio',
                            value: i + 1,
                            name: 'question' + num
                        }).appendTo(quizz.conteneur);
                        //1)injecte la référence de la réponse 'checkée' par l'utilisateur..
                        //  ..ds le tableau tabReponse
                        //2)colorie la case de la jauge correspondant à la question
                        $('input').eq(i).on('change', function () {
                            quizz.tabReponse[numero_q] = $(this).attr('value');

                            if (!quizz.validation) {


                                $('#jauge div').eq(numero_q - 1).css('background-color', 'gray');
                            }
                        });
                        //...
                    }
                    if (quizz.validation === true) {


                        quizz.gestionValidation(questions, numero_q);
                    }
                    //visuel --> coche la case correspondant à une éventuelle réponse enregistrée
                    var checked = quizz.tabReponse[numero_q];

                    $('input').eq(checked - 1).attr('checked', true);

                    for (i = 0; i <= quizz.nb_q; i++) {

                        if (i == (numero_q - 1)) {


                            $('#jauge div').eq(numero_q - 1).css({'border-color': 'blue', 'border-width': '2px'/*,'width':'13px','height':'13px'*/});

                        } else {


                            $('#jauge div').eq(i).css({'border-color': 'gray', 'border-width': '1px'/*,'width':'15px','height':'15px'*/});
                        }
                    }
                },
                error: function (questions) {

                    quizz.conteneur.html("<p>Erreur d'exécution de la requête.</p><p>type: <b>" + questions.status + "</b></p>");
                }
            });
        }, 500);//test fonction 'loadAjax' (2/2)
    },
    gestionValidation: function (questions, numero_q) {

        //calcule le résultat obtenu et colorie la case correspondant à la réponse
        var result = 0;
        for (var i = 1; i <= quizz.nb_q; i++) {

            if ((quizz.tabReponse[i] == quizz.tabCorrection[i]) && typeof (quizz.tabCorrection[i]) !== 'undefined') {


                $('#jauge div').eq(i - 1).css('background-color', 'green');//true
                result++;

            } else {


                $('#jauge div').eq(i - 1).css('background-color', 'red'/*rgb(250,100,100)'*/);//false
            }
        }
        //colorie en rouge les réponses de l'utilisateur
        $('label').eq(quizz.tabReponse[numero_q]).css({'color': 'red', 'font-weight': 'bold'});

        //colorie en vert les bonnes réponses (écrase le rouge en vert si réponses communes)
        $('label').eq(questions.correct).css({'color': 'green', 'font-weight': 'bold'});

        //délie l'input du formulaire pour pouvoir le 'checked'
        $('input').eq(questions.correct - 1).removeAttr('name').attr('checked', true);

        //vérouille le formulaire
        $(':radio').attr('disabled', true);

        //affiche le score
        $('span').eq(0).html('Score: ' + result + '/' + quizz.nb_q);

        //affiche une icône selon l'état de la réponse
        var $img = $('<img/>');
        $img.prependTo(quizz.conteneur);
        var src = (quizz.tabReponse[numero_q] == quizz.tabCorrection[numero_q]) ? 'img/true.png' : 'img/false.png';
        $img.attr('src', src);
    }

} : $('body:eq(0)').html('<p color="red"><b>Conflit lors de la création du namespace.</b></p><p>Veuillez contacter le webmestre.</p>');


$(function () {

    var $button = quizz.init();
    quizz.nb_q = quizz.getNbQuestions();

    quizz.suivant.on('click', quizz.init_quizz);
    quizz.precedent.on('click', quizz.init_quizz);
    quizz.valider.on('click', quizz.init_quizz);
    //active au click la gestion de la validation des réponses
    quizz.valider.on('click', function () {
        quizz.validation = true;
    });
    //
    $button.on('click', quizz.start_quizz);
    $button.on('click', quizz.constructJauge);

});




