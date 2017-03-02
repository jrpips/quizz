<?php

// Questions And Answers
$questions = array(
    '1' => array(
        'question' => 'En quelle année eut lieu la bataille de Waterloo?',
        'propositions' => array(
            '1805',
            '1815',
            '1830'
        ),
        'correct' => 2
    ),
    '2' => array(
        'question' => 'Combien d\'années a duré la guerre de cent ans ?',
        'propositions' => array(
            '92',
            '100',
            '116'
        ),
        'correct' => 3
    ),
    '3' => array(
        'question' => 'Combien de titres de champion de Belgique de football Anderlecht a-t-il remportés ?',
        'propositions' => array(
            '29',
            '33',
            '35'
        ),
        'correct' => 2
    ),
    '4' => array(
        'question' => 'Quelle est la longueur du circuit de Francorchamps ?',
        'propositions' => array(
            '7004 m',
            '7142 m ',
            '7215 m'
        ),
        'correct' => 1
    ),
    '5' => array(
        'question' => 'Combien de titres Nadal a-t-il remporté en senior à Roland-Garros ?',
        'propositions' => array(
            '7',
            '8',
            '9'
        ),
        'correct' => 3
    ),
    '6' => array(
        'question' => 'Combien de planètes comporte notre système solaire ?',
        'propositions' => array(
            '7',
            '8',
            '9'
        ),
        'correct' => 2
    ),
    '7' => array(
        'question' => 'Combien de titres de Mister Olympia Arnold Schwarzenegger a-t-il remporté?',
        'propositions' => array(
            '7',
            '8',
            '9'
        ),
        'correct' => 1
    )
);
$return = array();

if (isset($_GET['action'])) {
    $return=count($questions);
}

if (isset($_GET['num_question'])) {
    if (array_key_exists($_GET['num_question'], $questions)) {
        $return = $questions[$_GET['num_question']];
    }
}
echo json_encode($return);
?>
