jQuery.fn.tcf_quiz = function(options) {

    var defaults = {
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
            if (settings.questions[settings.currentQuestion - 1].questionType == "multi-choice") {
                methods.buildMultiChoice();
            }
        },

        buildMultiChoice: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            var wrap = settings.elements.answersWrap;
            wrap.html("");
            $(current).each(function(i) {
                var text = current[i].answerText;
                if (current[i].correctAnswer) {
                    var input = "<input data-correct='1' type='radio' name='tcf-multi-choice'/> ";
                }
                else {
                    var input = "<input data-correct='0' type='radio' name='tcf-multi-choice'/> ";
                }
                wrap.append("<p>" + input + "" + text + "</p>");
            })
        },

        appendButtons: function() {
            settings.elements.buttonWrap.append(settings.elements.checkBtn);
            settings.elements.buttonWrap.append(settings.elements.nextBtn.hide());
            settings.elements.buttonWrap.append(settings.elements.resetBtn.hide());
        },

        bindButtons: function() {
            var currentType = settings.questions[settings.currentQuestion - 1].questionType;
            settings.elements.checkBtn.on("click", function() {
                if (currentType == "multi-choice") {
                    methods.checkMultiChoiceAnswers();
                }
            })
            settings.elements.nextBtn.on("click", function() {
                methods.nextQuestion();
            })
            settings.elements.resetBtn.on("click", function() {
                methods.resetQuiz();
            })
        },

        checkMultiChoiceAnswers: function(type) {
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
                children.find("input[type='radio']").attr("disabled", "disabled")
            }
        },

        appendCorrectFeedback: function(i) {
            var current = settings.questions[settings.currentQuestion - 1];
            settings.correctCount++;
            settings.elements.checkBtn.hide();
            settings.elements.nextBtn.show();
            if (settings.currentQuestion == settings.questions.length) {
                settings.elements.nextBtn.html("Finish Quiz");
            }

            if (current.answers[i].feedback != undefined) {
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
            if (settings.advanceOnIncorrect) {
                settings.elements.checkBtn.hide();
                settings.elements.nextBtn.show();
                if (settings.currentQuestion == settings.questions.length) {
                    settings.elements.nextBtn.html("View Results");
                }

                if (current.answers[i].feedback != undefined) {
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
            settings.elements.feedbackWrap.html("Please select an answer.");
        },

        nextQuestion: function() {
            if (settings.currentQuestion == settings.questions.length) {
                methods.finalFeedback();
                settings.elements.resetBtn.show();
                settings.elements.nextBtn.hide();
            }
            else {
                settings.currentQuestion++;
                methods.appendQuestion();
                methods.appendAnswers();
                methods.updateQuestionCounter();
                settings.elements.checkBtn.show();
                settings.elements.nextBtn.hide();
            }
        },

        finalFeedback: function() {
            settings.elements.questionWrap.hide();
            settings.elements.answersWrap.hide();
            settings.elements.feedbackWrap.html("Congrats");
        },

        resetQuiz: function() {
            settings.currentQuestion = 1;
            settings.correctCount = 0;
            methods.appendQuestion();
            methods.appendAnswers();
            methods.updateQuestionCounter();
            settings.elements.questionWrap.show();
            settings.elements.answersWrap.show();
            settings.elements.checkBtn.show();
            settings.elements.nextBtn.hide();
            settings.elements.resetBtn.hide();
        },
    };

    return this.each(function() {
        settings.elements = {};
        settings.elements.main = $(this);
        methods.init(this);
    });
};
