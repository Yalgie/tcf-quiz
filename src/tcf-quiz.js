jQuery.fn.tcf_quiz = function(options) {

    var defaults = {
        currentQuestion: 1,
        correctCount: 0,
        titleText: "Quiz",
        instructions: "Please answer the below questions.",
        advanceOnIncorrect: true,
        finalCorrectFeedback: "Congratulations! You got all the questions correct.",
        finalIncorrectFeedback: "You got some questions incorrect, please try again.",
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
            settings.elements.questionWrap = $("<div class='tcf-quiz-tb'>");
            settings.elements.answersWrap = $("<div>");
            settings.elements.buttonWrap = $("<div>");
            settings.elements.feedbackWrap = $("<div>");
            settings.elements.titleText = $("<h1>" + settings.titleText + "</h1>");
            settings.elements.instructions = $("<p class='tcf-quiz-tb'>" + settings.instructions + "</p>");
            settings.elements.questionCounter = $("<p class='tcf-quiz-counter'></p>");
            settings.elements.checkBtn = $("<button type='button'>Check Answers</button>");
            settings.elements.nextBtn = $("<button type='button'>Next Question</button>");
            settings.elements.resetBtn = $("<button type='button'>Reset Quiz</button>");
        },

        appendWrappers: function() {
            settings.elements.main.append(settings.elements.headerWrap);
            settings.elements.main.append(settings.elements.questionWrap);
            settings.elements.main.append(settings.elements.answersWrap);
            settings.elements.main.append(settings.elements.buttonWrap);
            settings.elements.main.append(settings.elements.feedbackWrap);
        },

        appendHeaderChildren: function() {
            settings.elements.headerWrap.append(settings.elements.questionCounter);
            settings.elements.headerWrap.append(settings.elements.titleText);
            settings.elements.headerWrap.append(settings.elements.instructions);
        },

        updateQuestionCounter: function() {
            var counterStr = "<b>" + settings.currentQuestion + "</b>/" + settings.questions.length;
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
            else if (type == "cloze") {
                methods.buildClozeAnswer();
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
            settings.elements.answersWrap.append("<textarea></textarea>");
        },

        buildClozeAnswer: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers[0].answerText;
            var html = methods.extractClozeQuestion(current);
            settings.elements.answersWrap.html("");
            settings.elements.answersWrap.append(html);
        },

        extractClozeQuestion: function(str) {
            var bracketArr = [];
            $.each(str.split(''),function(i,v){
                if(v == "[") bracketArr.push(i+1);
                if(v == "]") bracketArr.push(i);
            });

            return(methods.getClozeAnswerArr(bracketArr, str))
        },

        getClozeAnswerArr: function(arr, str) {
            var tempArr = [];

            tempArr.push(str.substring(0, arr[0]))
            $.each(arr,function(i,v){
                tempArr.push(str.substring(arr[i], arr[i+1]))
            });

            var htmlArr = [];
            $.each(tempArr,function(i,v){
                if (tempArr[i].endsWith("[") && tempArr[i].startsWith("]")) {
                    htmlArr.push(tempArr[i].substring(1,(tempArr[i].length) - 1))
                }
                else if (tempArr[i].startsWith("]")) {
                    htmlArr.push(tempArr[i].substring(1,tempArr[i].length))
                }
                else if (tempArr[i].endsWith("[")) {
                    htmlArr.push(tempArr[i].substring(0,(tempArr[i].length) - 1))
                }
                else {
                    var current = tempArr[i].split(",");
                    var tempHtml = [];
                    tempHtml.push("<select>")
                    tempHtml.push("<option value='none'>-- Select An Answer --</option>")
                    $.each(current,function(x,y){
                        var newStr = current[x].trim()
                        if (newStr.startsWith("*")) {
                            tempHtml.push("<option data-correct='true' value='"+newStr.replace("*","")+"'>"+newStr.replace("*","")+"</option>")
                        }
                        else {
                            tempHtml.push("<option value='"+newStr+"'>"+newStr+"</option>")
                        }
                    });
                    tempHtml.push("</select>")
                    htmlArr.push(tempHtml.join(""))
                }
            });

            function startsWith(prefix) {
                return this.indexOf(prefix) === 0;
            }

            function endsWith(suffix) {
                return this.match(suffix+"$") == suffix;
            }

            return(htmlArr.join(""))
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
                else if (currentType == "cloze") {
                    methods.checkClozeAnswer();
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
                methods.appendAlertFeedback("Please select an answer.");
            }
            else {
                if (selectedIndex == correctIndex) {
                    children.find("input[type='radio']").attr("disabled", "disabled");
                    methods.appendCorrectFeedback(selectedIndex);
                }
                else {
                    if (settings.advanceOnIncorrect) {
                        methods.appendIncorrectFeedback(selectedIndex);
                        children.find("input[type='radio']").attr("disabled", "disabled");
                    }
                    else {
                        methods.appendAlertFeedback("Incorrect, keep trying.")
                    }
                }
            }
        },

        checkCheckboxAnswers: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            var children = $(settings.elements.answersWrap.children());
            var correctLength = children.find("input[data-correct='1']").length;
            var correctCount = 0;
            var selected = children.find("input[type='checkbox']:checked");

            if (selected.length == 0) {
                methods.appendAlertFeedback("Please select an answer.");
            }
            else {
                children.find("input[type='checkbox']").each(function(i) {
                    if ($(this).is(":checked") && $(this).data("correct")) {
                        correctCount++;
                    }
                })
                if (correctCount == correctLength) {
                    children.find("input[type='checkbox']").attr("disabled", "disabled");
                    methods.appendCorrectFeedback();
                }
                else {
                    if (settings.advanceOnIncorrect) {
                        children.find("input[type='checkbox']").attr("disabled", "disabled");
                        methods.appendIncorrectFeedback();
                    }
                    else {
                        methods.appendAlertFeedback("Incorrect, keep trying.")
                    }
                }
            }
        },

        checkTextareaAnswer: function() {
            var textarea = $(settings.elements.answersWrap.children());
            if ($(textarea[0]).val().length == 0) {
                methods.appendAlertFeedback("Please enter your answer.");
            }
            else {
                textarea.attr("disabled", "disabled");
                methods.appendTextareaFeedback();
            }
        },

        checkClozeAnswer: function() {
            var children = $(settings.elements.answersWrap.children());
            var selects = children.find("select");
            var allSelected = true;
            var allCorrect = true;

            $(selects.prevObject).each(function(i) {
                if ($(this).val() == "none") {
                    $(this).css("border", "1px solid red")
                    allSelected = false;
                }
            })

            if (!allSelected) {
                methods.appendAlertFeedback("Please select all answers.");
                allCorrect = false;
            }
            else {
                $(selects.prevObject).find("option:selected").each(function(i) {
                    $(this).parent().attr("disabled", "disabled");
                    if ($(this).data("correct") == true) {
                        $(this).parent().css("border", "1px solid #1ED760")
                    }
                    else {
                        allCorrect = false;
                        $(this).parent().css("border", "1px solid #DE5246")
                    }
                })
            }

            if (allCorrect && allSelected) {
                methods.appendCorrectFeedback();
            }
            else if (!allCorrect && allSelected) {
                if (settings.advanceOnIncorrect) {
                    methods.appendIncorrectFeedback();
                }
                else {
                    methods.appendAlertFeedback("Incorrect, keep trying.")
                    $(selects.prevObject).each(function(i) {
                        $(this).removeAttr("disabled")
                    })
                }
            }
        },

        appendCorrectFeedback: function(i) {
            var current = settings.questions[settings.currentQuestion - 1];
            settings.elements.feedbackWrap.show();
            settings.correctCount++;
            settings.elements.checkBtn.hide();
            settings.elements.nextBtn.show().addClass("tcf-quiz-btn-correct");
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
            settings.elements.feedbackWrap.addClass("tcf-quiz-tb")
        },

        appendIncorrectFeedback: function(i) {
            var current = settings.questions[settings.currentQuestion - 1];
            settings.elements.feedbackWrap.show();
            if (settings.advanceOnIncorrect) {
                settings.elements.checkBtn.hide();
                settings.elements.nextBtn.show().addClass("tcf-quiz-btn-incorrect");
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
            settings.elements.feedbackWrap.addClass("tcf-quiz-tb")
        },

        appendAlertFeedback: function(str) {
            settings.elements.feedbackWrap.show();
            settings.elements.feedbackWrap.html("<p>" + str + "</p>");
            settings.elements.feedbackWrap.addClass("tcf-quiz-tb")
        },

        appendTextareaFeedback: function() {
            settings.elements.feedbackWrap.show();
            var model = settings.questions[settings.currentQuestion - 1].answers[0].answerText;
            settings.elements.feedbackWrap.html("<p'><b>Model Response:</b></p><p>" + model + "</p>");
            settings.elements.checkBtn.hide();
            settings.elements.nextBtn.show();
            settings.elements.feedbackWrap.addClass("tcf-quiz-tb")
        },

        nextQuestion: function() {
            settings.elements.nextBtn.removeClass("tcf-quiz-btn-correct")
            settings.elements.nextBtn.removeClass("tcf-quiz-btn-incorrect")
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

            var markable = 0;
            for (var i = 0; i < settings.questions.length; i++) {
                if (settings.questions[i].questionType != "textarea") {
                    markable++;
                }
            }
            if (markable == settings.correctCount) {
                settings.elements.feedbackWrap.html("<p>" + settings.finalCorrectFeedback + "</p>");
            }
            else {
                settings.elements.feedbackWrap.html("<p>" + settings.finalIncorrectFeedback + "</p>");
            }
            settings.elements.feedbackWrap.append("<p class='tcf-quiz-tb'>Click the reset button below to restart the quiz</p>")
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
        settings.elements.main = $(this).addClass("tcf-quiz-wrap");
        methods.init(this);
    });
};
