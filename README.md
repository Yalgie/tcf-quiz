#TCF-Quiz

TCF-Quiz is a jQuery plugin that makes inserting custom quizzes into your HTML fast and easy. The source code is also easily extendable by adding new methods. 

##Supported Question Types

* Multiple Choice
* Multiple Choices
* Short/Long Answer
* Cloze

##Dependencies
The only dependency for this plugin is jQuery

##Getting Started
Getting started is quick and easy.

###Step 1 
Download the repo and copy the minified files from the `/dist` folder and put them wherever you want.

###Step 2
Link to the files you've copied inside your HTML document.

`<link rel="stylesheet" href="css/tcf-quiz.min.css">`

`<script src="js/tcf-quiz.min.js"></script>`

###Step 3
Insert the initialsation script into a javascript file or embed it in your html file with `<script>` tags.

```
$(document).ready(function() {
    $("#quiz-id").tcf_quiz({
        // ... Insert Questions (See Creating Questions Section) ...
    })
})
```

###Step 4
Insert a div with the same ID used in your initialisition script into your HTML.

```
<div id="quiz-id"></div>
```


##Creating Questions
I'll be building a WYSIWG quiz builder in the future, after i've finished the source code for the quiz itself but it's still pretty simple to create questions.