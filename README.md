#TCF-Quiz

TCF-Quiz is a jQuery plugin that makes creating and inserting custom quizzes into your HTML fast and easy.

##Supported Question Types

* Multiple Choice
* Multiple Choices
* Short/Long Answer
* Cloze

##Dependencies
* jQuery

##Getting Started
Getting started is quick and easy. Follow the steps below:

####Step 1
Download the repo and copy the minified files from the `/dist` folder and put them wherever you want.

####Step 2
Link to the files you've copied inside your HTML document.

```html
<link rel="stylesheet" href="css/tcf-quiz.min.css">
<script src="js/tcf-quiz.min.js"></script>
```

####Step 3
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

####Step 4
Insert a div with the same ID used in your initialisition script into your HTML.

```html
<div id="quiz-id"></div>
```
You're good to go now! All you've got to do now is create your questions. Check out some examples below to get your started.

##Creating Questions
I'll be building a WYSIWG quiz builder in the future, after i've finished the source code for the quiz itself but it's still pretty simple to create questions. Take a look at the examples below and modify them to suit your needs.

You can use html inside the variables below if you want to. Just don't wrap it in a `<p>` tag otherwise it'll break the layout. Also make sure you keep it all on the same line i.e. no line breaks.

####Example Multiple Choice Question
Multiple Choice questions can only have one correct answer. You can have as many options as you want.

The questionType must be set to "radio" and questionText can be whatever you like.

```javascript
{
    questionType: "radio",
    questionText: "Answer is B.",
    answers: [{
        answerText: "You <em>can use</em> html <b>if you'd like</b>"
    }, {
        answerText: "B",
        correctAnswer: true,
    }, {
        answerText: "C"
    }, {
        answerText: "D"
    }]
}
```

####Example Multiple Choices Question
Multiple Choice questions can only have as many correct answers as you'd like. You can also have as many options as you want.

The questionType must be set to "checkbox" and questionText can be whatever you like.

```javascript
{
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
}
```

####Example Short/Long Question
Short/Long questions can not be graded so instead of defining a correct answer, a model response should be supplied that the user can compare their answer to.

The questionType must be set to "textarea" and questionText can be whatever you like.

```javascript
{
    questionType: "textarea",
    questionText: "Enter some text.",
    answers: [{
        answerText: "Model Response",
    }]
}
```

####Example Cloze Question
Cloze questions are defined by wrapping them inside brackets. The correct answer within the brackets is defined with an asterisk (*).

The questionType must be set to "cloze" and questionText can be whatever you like.
```javascript
{
    questionType: "cloze",
    questionText: "Select the correct answers below.",
    answers: [{
        answerText: "Select the correct drop down [*correct, incorrect] and do it again [incorrect, *correct]"
    }]
}
```

##Basic Example
```javascript
$(document).ready(function() {
    $("#quiz-id").tcf_quiz({
    	// Advanced Options Can Go Here
        questions: [{
            questionType: "textarea",
            questionText: "Enter some text.",
            answers: [{
                answerText: "Model Answer",
            }]
        }, {
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
        }, {
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
        }, {
            questionType: "cloze",
            questionText: "Select the correct answers below.",
            answers: [{
                answerText: "This is a cloze activity select the correct drop down [*correct, incorrect] and again [incorrect, *correct]"
            }]
        }]
    })
})
```

##Adding Feedback
There are three types of feedback:

* Correct
* Incorrect
* Generic

Feedback can be attached to each question like the example below. If generic feedback is defined it will show up regardless if the question is correct or incorrect. If correct or incorrect feedback is defined it will replace the genreic feedback.

Having feedback is not neccessary, if nothing is defined it will just default to say "Correct" if the answer is correct or "Incorrect" if the answer is incorrect.

The Short/Long (textarea) Question Type does not support feedback as it can not be marked and the model response is displayed as it's own form of feedback.

```javascript
$(document).ready(function() {
    $("#quiz-id").tcf_quiz({
        questions: [{
            questionType: "",
            questionText: "",
            answers: [{
                // Question Goes Here
            }],
            feedback: [{
            	correct: "Custom Correct Feedback",
            	incorrect: "Custom Incorrect Feedback"
            }]            
        }, {
            questionType: "",
            questionText: "",
            answers: [{
                // Question Goes Here
            }],
            feedback: [{
            	generic: "Custom Generic Feedback That Shows Up On Correct Or Incorrect Answers"
            }]            
        }]
    })
})
```

The Multiple Choice (radio) question type has some more in depth feedback options, where you can specify feedback for each individual answer. See below for an example of this. If the question selected has specific feedback, it will override the custom feedback for the overall question.

```javascript
{
    questionType: "radio",
    questionText: "Answer is B.",
    answers: [{
        answerText: "A",
        feedback: "Custom Feedback 1 For This Answer If Selected"
    }, {
        answerText: "B",
        correctAnswer: true,
        feedback: "Custom Feedback 2 For This Answer If Selected"
    }, {
        answerText: "C"
    }, {
        answerText: "D"
    }],
    feedback: [{
        // This will not show up if option A and B are selected as their specific feedback will override this feedback.
        correct: "Custom Correct Feedback For Q3",
        incorrect: "Custom Incorrect Feedback For Q3",
    }]
}
```

##Options
There are a few options which help customize each quiz instance:

####Title Text
```javascript
titleText: "Title of the Quiz"
```
This defines the title of your quiz. The default is "Quiz". You can change this to whatever you'd like.

####Instructions
```javascript
instructions: "Instructions for the quiz"
```
This defines the instructions for your quiz. The default is "Please answer the below questions.". You can change this to whatever you'd like.

####Advance On Incorrect
```javascript
advanceOnIncorrect: true
```
If this is set to true when the user gets a question wrong it will allow them to proceed tot he next question. However if this is set to false, when the user gets a question incorrect they will not proceed to the next question until they get the question correct. The default is true.

####Final Correct Feedback
```javascript
finalCorrectFeedback: "Congrats!!"
```
If the user completes the quiz and they got all the questions correct this feedback message will be displayed. The default message is "Congratulations! You got all the questions correct."

####Final Incorrect Feedback
```javascript
finalIncorrectFeedback: "Try Again"
```
If the user completes the quiz and they got at least 1 question wrong this feedback message will be displayed. The default message is "You got some questions incorrect, please try again."

##Advanced Example
An advanced example with all the custom options can be seen below.
```javascript
$(document).ready(function() {
    $("#quiz-id").tcf_quiz({
        // Custom Options
        titleText: "Custom Quiz Title",
        instructions: "Custom Instructions",
        advanceOnIncorrect: true,
        finalCorrectFeedback: "Congrats, you got everything correct!",
        finalIncorrectFeedback: "You got some questions wrong, try again.",

        questions: [
        { // Question 1 Start
            questionType: "textarea",
            questionText: "Enter some text.",
            answers: [{
                answerText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat commodi, ipsa error accusamus quasi minima velit, amet quis! Beatae excepturi accusantium cumque consequuntur laboriosam vero labore optio nulla, quam! Perspiciatis.",
            }]
        }, // Question 1 End
        {  // Question 2 Start
            questionType: "checkbox",
            questionText: "Answer is A & C.",
            answers: [{
                answerText: "A - You can use html <b>if you'd like</b>",
                correctAnswer: true
            }, {
                answerText: "B"
            }, {
                answerText: "C",
                correctAnswer: true
            }, {
                answerText: "D"
            }],
            feedback: [{
                correct: "Custom Correct Feedback For Q2",
                incorrect: "Custom Incorrect Feedback For Q2",
            }]
        }, // Question 2 End
        {  // Question 3 Start
            questionType: "radio",
            questionText: "Answer is B.",
            answers: [{
                answerText: "A",
                feedback: "Custom Feedback 1 For This Answer If Selected"
            }, {
                answerText: "B",
                correctAnswer: true,
                feedback: "Custom Feedback 2 For This Answer If Selected"
            }, {
                answerText: "C",
                feedback: "Custom Feedback 3 For This Answer If Selected"
            }, {
                answerText: "D",
                feedback: "Custom Feedback 4 For This Answer If Selected"
            }],
            feedback: [{
                correct: "Custom Correct Feedback For Q3",
                incorrect: "Custom Incorrect Feedback For Q3",
            }]
        }, // Question 3 End
        {  // Question 4 Start
            questionType: "cloze",
            questionText: "Select the correct answers below.",
            answers: [{
                answerText: "This is a cloze activity [*correct, incorrect] select the correct answers from the drop downs [incorrect, *correct]"
            }],
            feedback: [{
                correct: "Custom Correct Feedback For Q4",
                incorrect: "Custom Incorrect Feedback For Q4",
            }]
        } // Question 4 End
    ]
    })
})
```
