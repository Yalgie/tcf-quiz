jQuery.fn.tcf_quiz = function(options) {
    // cloze
    // matching/sortable?
    var defaults = {
        finalFeedback: "Congrats",
        currentQuestion: 1,
        correctCount: 0,
        titleText: "Quiz",
        instructions: "Please answer the below questions.",
        advanceOnIncorrect: true,
    };

    var settings = $.extend( {}, defaults, options );

    var methods = {
        init: function() {
            methods.createElementVariables();
            methods.appendWrappers();
            methods.appendHeaderChildren();
            methods.updateQuestionCounter();
            methods.appendQuestion();
            methods.appendAnswers();
            methods.appendButtons();
            methods.bindButtons();
        },

        createElementVariables: function() {
            settings.elements.headerWrap = $("<div>");
            settings.elements.questionWrap = $("<div>");
            settings.elements.answersWrap = $("<div>");
            settings.elements.buttonWrap = $("<div>");
            settings.elements.feedbackWrap = $("<div>");
            settings.elements.titleText = $("<h1>" + settings.titleText + "</h1>");
            settings.elements.instructions = $("<p>" + settings.instructions + "</p>");
            settings.elements.questionCounter = $("<p></p>");
            settings.elements.checkBtn = $("<button>Check Answers</button>");
            settings.elements.nextBtn = $("<button>Next Question</button>");
            settings.elements.resetBtn = $("<button>Reset Quiz</button>");
        },

        appendWrappers: function() {
            settings.elements.main.append(settings.elements.headerWrap);
            settings.elements.main.append(settings.elements.questionWrap);
            settings.elements.main.append(settings.elements.answersWrap);
            settings.elements.main.append(settings.elements.buttonWrap);
            settings.elements.main.append(settings.elements.feedbackWrap);
        },

        appendHeaderChildren: function() {
            settings.elements.headerWrap.append(settings.elements.titleText);
            settings.elements.headerWrap.append(settings.elements.instructions);
            settings.elements.headerWrap.append(settings.elements.questionCounter);
        },

        updateQuestionCounter: function() {
            var counterStr = settings.currentQuestion + "/" + settings.questions.length;
            settings.elements.questionCounter.html(counterStr);
        },

        appendQuestion: function() {
            settings.elements.questionWrap.html("")
            var current = settings.questions[settings.currentQuestion - 1];
            settings.elements.questionWrap.append("<p>" + current.questionText + "</p>");
        },

        appendAnswers: function() {
            var type = settings.questions[settings.currentQuestion - 1].questionType;
            if (type == "radio") {
                methods.buildRadioAnswers();
            }
            else if (type == "checkbox") {
                methods.buildCheckboxAnswers();
            }
            else if (type == "textarea") {
                methods.buildTextareaAnswer();
            }
        },

        buildRadioAnswers: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            settings.elements.answersWrap.html("");
            $(current).each(function(i) {
                var text = current[i].answerText;
                if (current[i].correctAnswer) {
                    var input = "<input data-correct='1' type='radio' name='tcf-radio'/> ";
                }
                else {
                    var input = "<input data-correct='0' type='radio' name='tcf-radio'/> ";
                }
                settings.elements.answersWrap.append("<p>" + input + "" + text + "</p>");
            })
        },

        buildCheckboxAnswers: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            settings.elements.answersWrap.html("");
            $(current).each(function(i) {
                var text = current[i].answerText;
                if (current[i].correctAnswer) {
                    var input = "<input data-correct='1' type='checkbox' name='tcf-checkbox'/> ";
                }
                else {
                    var input = "<input data-correct='0' type='checkbox' name='tcf-checkbox'/> ";
                }
                settings.elements.answersWrap.append("<p>" + input + "" + text + "</p>");
            })
        },

        buildTextareaAnswer: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            settings.elements.answersWrap.html("");
            settings.elements.answersWrap.append("<textarea rows='5'></textarea>");
        },

        appendButtons: function() {
            settings.elements.buttonWrap.append(settings.elements.checkBtn);
            settings.elements.buttonWrap.append(settings.elements.nextBtn.hide());
            settings.elements.buttonWrap.append(settings.elements.resetBtn.hide());
        },

        bindButtons: function() {
            settings.elements.checkBtn.click(function() {
                var currentType = settings.questions[settings.currentQuestion - 1].questionType;
                if (currentType == "radio") {
                    methods.checkRadioAnswers();
                }
                else if (currentType == "checkbox") {
                    methods.checkCheckboxAnswers();
                }
                else if (currentType == "textarea") {
                    methods.checkTextareaAnswer();
                }
            })
            settings.elements.nextBtn.click(function() {
                methods.nextQuestion();
            })
            settings.elements.resetBtn.click(function() {
                methods.resetQuiz();
            })
        },

        checkRadioAnswers: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            var children = $(settings.elements.answersWrap.children());
            var selected = children.find("input[type='radio']:checked");
            var selectedIndex = selected.parent().index();
            var correctIndex = children.find("input[data-correct='1']").parent().index();
            if (selected.length == 0) {
                methods.appendAlertFeedback();
            }
            else {
                if (selectedIndex == correctIndex) {
                    methods.appendCorrectFeedback(selectedIndex);
                }
                else {
                    methods.appendIncorrectFeedback(selectedIndex);
                }
                children.find("input[type='radio']").attr("disabled", "disabled");
            }
        },

        checkCheckboxAnswers: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            var children = $(settings.elements.answersWrap.children());
            var correctLength = children.find("input[data-correct='1']").length;
            var correctCount = 0;
            var selected = children.find("input[type='checkbox']:checked");

            if (selected.length == 0) {
                methods.appendAlertFeedback();
            }
            else {
                children.find("input[type='checkbox']").each(function(i) {
                    if ($(this).is(":checked")) {
                        correctCount++;
                    }
                })
                if (correctCount == correctLength) {
                    methods.appendCorrectFeedback();
                }
                else {
                    methods.appendIncorrectFeedback();
                }
                children.find("input[type='checkbox']").attr("disabled", "disabled");
            }
        },

        checkTextareaAnswer: function() {
            var children = $(settings.elements.answersWrap.children());
            var textarea = children.find("textarea");
            if ($(children[0]).val().length == 0) {
                methods.appendAlertFeedback();
            }
            else {
                textarea.attr("disabled", "disabled");
                methods.appendTextareaFeedback();
            }
        },

        appendCorrectFeedback: function(i) {
            var current = settings.questions[settings.currentQuestion - 1];
            settings.elements.feedbackWrap.show();
            settings.correctCount++;
            settings.elements.checkBtn.hide();
            settings.elements.nextBtn.show();
            if (settings.currentQuestion == settings.questions.length) {
                settings.elements.nextBtn.html("Finish Quiz");
            }

            if (current.questionType == "radio" && current.answers[i].feedback != undefined) {
                settings.elements.feedbackWrap.html("<p>" + current.answers[i].feedback + "</p>");
            }
            else if (current.feedback != undefined) {
                if (current.feedback[0].correct != undefined) {
                    settings.elements.feedbackWrap.html("<p>" + current.feedback[0].correct + "</p>");
                }
                else if (current.feedback[0].generic != undefined) {
                    settings.elements.feedbackWrap.html("<p>" + current.feedback[0].generic + "</p>");
                }
                else {
                    settings.elements.feedbackWrap.html("<p>Correct</p>");
                }
            }
            else {
                settings.elements.feedbackWrap.html("<p>Correct</p>");
            }
        },

        appendIncorrectFeedback: function(i) {
            var current = settings.questions[settings.currentQuestion - 1];
            settings.elements.feedbackWrap.show();
            if (settings.advanceOnIncorrect) {
                settings.elements.checkBtn.hide();
                settings.elements.nextBtn.show();
                if (settings.currentQuestion == settings.questions.length) {
                    settings.elements.nextBtn.html("View Results");
                }

                if (current.questionType == "radio" && current.answers[i].feedback != undefined) {
                    settings.elements.feedbackWrap.html("<p>" + current.answers[i].feedback + "</p>");
                }
                else if (current.feedback != undefined) {
                    if (current.feedback[0].incorrect != undefined) {
                        settings.elements.feedbackWrap.html("<p>" + current.feedback[0].incorrect + "</p>");
                    }
                    else if (current.feedback[0].generic != undefined) {
                        settings.elements.feedbackWrap.html("<p>" + current.feedback[0].generic + "</p>");
                    }
                    else {
                        settings.elements.feedbackWrap.html("<p>Incorrect</p>");
                    }
                }
                else {
                    settings.elements.feedbackWrap.html("<p>Incorrect</p>");
                }
            }
        },

        appendAlertFeedback: function() {
            settings.elements.feedbackWrap.show();
            settings.elements.feedbackWrap.html("Please select an answer.");
        },

        appendTextareaFeedback: function() {
            settings.elements.feedbackWrap.show();
            var model = settings.questions[settings.currentQuestion - 1].answers[0].answerText;
            settings.elements.feedbackWrap.html("<p>Model Response:</p><p>" + model + "</p>");
            settings.elements.checkBtn.hide();
            settings.elements.nextBtn.show();
        },

        nextQuestion: function() {
            if (settings.currentQuestion == settings.questions.length) {
                settings.elements.feedbackWrap.hide();
                methods.finalFeedback();
                settings.elements.resetBtn.show();
                settings.elements.nextBtn.hide();
            }
            else {
                settings.elements.feedbackWrap.hide();
                settings.currentQuestion++;
                methods.appendQuestion();
                methods.appendAnswers();
                methods.updateQuestionCounter();
                settings.elements.checkBtn.show();
                settings.elements.nextBtn.hide();
            }
        },

        finalFeedback: function() {
            settings.elements.feedbackWrap.detach();
            settings.elements.feedbackWrap.insertBefore(settings.elements.buttonWrap);
            settings.elements.feedbackWrap.show();
            settings.elements.questionWrap.hide();
            settings.elements.answersWrap.hide();
            settings.elements.feedbackWrap.html("<p>" + settings.finalFeedback + "</p>");
        },

        resetQuiz: function() {
            settings.elements.feedbackWrap.detach().hide();
            settings.elements.feedbackWrap.insertAfter(settings.elements.buttonWrap);
            settings.currentQuestion = 1;
            settings.correctCount = 0;
            methods.appendQuestion();
            methods.appendAnswers();
            methods.updateQuestionCounter();
            settings.elements.questionWrap.show();
            settings.elements.answersWrap.show();
            settings.elements.checkBtn.show();
            settings.elements.nextBtn.hide().html("Next Question");
            settings.elements.resetBtn.hide();
        },
    };

    return this.each(function() {
        settings.elements = {};
        settings.elements.main = $(this);
        methods.init(this);
    });
};
