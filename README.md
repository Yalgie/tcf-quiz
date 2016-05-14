#TCF-Quiz

TCF-Quiz is a jQuery plugin that makes inserting custom quizzes into your HTML fast and easy. The source code is also easily extendable by adding new methods. 

##Supported Question Types

* Multiple Choice
* Multiple Choices
* Short/Long Answer
* Cloze

##Dependencies
* jQuery

##Getting Started
Getting started is quick and easy. Follow the steps below:

###Step 1 
Download the repo and copy the minified files from the `/dist` folder and put them wherever you want.

###Step 2
Link to the files you've copied inside your HTML document.

```html
<link rel="stylesheet" href="css/tcf-quiz.min.css">
<script src="js/tcf-quiz.min.js"></script>
```

###Step 3
Insert the initialsation script into a javascript file or embed it in your html file with `<script>` tags.

```javascript
$(document).ready(function() {
    $("#quiz-id").tcf_quiz({
        questions: [{
            questionType: "",
            questionText: "",
            answers: [{
                // See Creating Questions Section Below
            }]
        }]
    })
})
```

###Step 4
Insert a div with the same ID used in your initialisition script into your HTML.

```html
<div id="quiz-id"></div>
```


##Creating Questions
I'll be building a WYSIWG quiz builder in the future, after i've finished the source code for the quiz itself but it's still pretty simple to create questions.

###Creating Multiple Choice Question
```javascript
questions: [{
    questionType: "radio",
    questionText: "Answer is B.",
    answers: [{
        answerText: "A"
    }, {
        answerText: "B",
        correctAnswer: true,
    }, {
        answerText: "C"
    }, {
        answerText: "D"
    }]
}]
```

###Creating Multiple Choices Question
```javascript
questions: [{
    questionType: "checkbox",
    questionText: "Answer is A & C.",
    answers: [{
        answerText: "A",
        correctAnswer: true
    }, {
        answerText: "B"
    }, {
        answerText: "C",
        correctAnswer: true
    }, {
        answerText: "D"
    }]
}]
```

###Creating Short/Long Question
```javascript
questions: [{
    questionType: "textarea",
    questionText: "Enter some text.",
    answers: [{
        answerText: "Model Response",
    }]
}]
```

###Creating Cloze Question
```javascript
questions: [{
    questionType: "cloze",
    questionText: "Select the correct answers below.",
    answers: [{
        answerText: "Select the correct drop down [*correct, incorrect] and do it again [incorrect, *correct]"
    }]
}]
```