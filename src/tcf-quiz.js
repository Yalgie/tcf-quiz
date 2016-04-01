jQuery.fn.tcf_quiz = function(options) {

    var defaults = {
        currentQuestion: 1,
        titleText: "Quiz",
        instructions: "Please answer the below questions."
    };

    var settings = $.extend( {}, defaults, options );

    var methods = {
        init: function() {
            methods.createElementVariables();
            methods.appendWrappers();
            methods.appendHeaderChildren();
            methods.updateQuestionCounter();
            methods.appendQuestion();
        },

        createElementVariables: function() {
            settings.elements.headerWrap = $("<div>");
            settings.elements.questionWrap = $("<div>");
            settings.elements.feedbackWrap = $("<div>");
            settings.elements.titleText = $("<h1>" + settings.titleText + "</h1>");
            settings.elements.instructions = $("<p>" + settings.instructions + "</p>");
            settings.elements.questionCounter = $("<p></p>");
        },

        appendWrappers: function() {
            settings.elements.main.append(settings.elements.headerWrap);
            settings.elements.main.append(settings.elements.questionWrap);
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
            if (settings.questions[settings.currentQuestion - 1].questionType == "multi-choice") {
                methods.buildMultiChoice();
            }
        },

        buildMultiChoice: function() {
            var current = settings.questions[settings.currentQuestion - 1].answers;
            $(current).each(function(i) {
                console.log(current[i].answerText);
            })
        },
    };

    return this.each(function() {
        settings.elements = {};
        settings.elements.main = $(this);
        methods.init(this);
    });
};
