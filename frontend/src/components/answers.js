import {UrlManager} from "../utils/url-manager.js";

export class Answers {
    constructor() {

        this.quiz = null;
        this.currentQuestionIndex = 1;
        this.testAnswers = null;
        this.resultAnswers = [];
        this.rightAnswers = [];

        this.routeParams = UrlManager.getQueryParams();
        const name = this.routeParams.name;
        const lastName = this.routeParams.lastName;
        const email = this.routeParams.email;

        const testId = this.routeParams.id;

        const results = this.routeParams.results;
        this.resultAnswers = results.split(',').map(Number);

        console.log('Test ID:', testId); // Лог для проверки наличия testId и других данных
        console.log('URL Parameters:', {name, lastName, email});

        if (testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = '#/index';
                }
                document.getElementById('test-number').innerText = this.quiz.name;
                document.getElementById('person-info').innerText = name + ' ' + lastName + ', ' + email;

                this.getRightAnswers();
                this.getTestResults();
                this.backToResults();

            } else {
                location.href = '#/index';
            }
        } else {
            location.href = '#/index';
        }
        const testNumberElement = document.getElementById('test-number');
        const personInfoElement = document.getElementById('person-info');
        if (!testNumberElement || !personInfoElement) {
            console.error('Element not found');
        }
    }


    getTestResults() {

        this.testAnswers = document.getElementById('test-answers');

        const testQuestions = this.quiz.questions;

        testQuestions.forEach(item => {
            const testAnswer = document.createElement('div');
            testAnswer.className = 'answers__content';
            // создание блока с номером и title вопроса
            const testQuestionTitle = document.createElement('div');
            testQuestionTitle.className = 'answers__main-title';
            testQuestionTitle.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex++
                + ':</span> ' + item.question;
            // создание блока с 3 ответами
            const optionElements = document.createElement('div');
            optionElements.className = 'answers__question-options';

            item.answers.forEach(answer => {
                const optionElement = document.createElement('div');
                optionElement.className = 'answers__question-option';


                const inputId = 'answer-' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.className = 'answers__radio';
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('value', answer.id);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                const userAnswer = this.resultAnswers.some(resultAnswer => resultAnswer === answer.id);
                if (userAnswer) {
                    inputElement.setAttribute('checked', 'checked');
                    if (this.rightAnswers.some(rightAnswer => rightAnswer === answer.id)) {
                        inputElement.className = 'right-answer';
                        labelElement.className = 'right-answer';
                    } else {
                        inputElement.className = 'wrong-answer';
                        labelElement.className = 'wrong-answer';
                    }
                }

                inputElement.setAttribute('disabled', 'disabled');


                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);
                optionElements.appendChild(optionElement);
            })

            testAnswer.appendChild(testQuestionTitle);
            testAnswer.appendChild(optionElements);
            this.testAnswers.appendChild(testAnswer);
        })
    }


    getRightAnswers() {
        this.routeParams = UrlManager.getQueryParams();
        const testId = this.routeParams.id;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
        xhr.send();
        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.rightAnswers = JSON.parse(xhr.responseText);
            } catch (e) {
                location.href = '#/index';
            }
        } else {
            location.href = '#/index';
        }
    }

    backToResults() {
        let backToResults = document.getElementById('back-result');
        backToResults.onclick = function () {
            window.history.back();
        }
    }

}