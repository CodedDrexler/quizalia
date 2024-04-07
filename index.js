const categoryButtons = document.querySelectorAll('.initial__categories > button');
const initialPage = document.querySelector('.initial__page');
const questionPage = document.querySelector('.question__page');
const questionTitle = document.querySelector('.question__title');
const questionCommand = document.querySelector('.question__command');
const questionOptions = document.querySelectorAll('.question__button');
const nextButton = document.getElementById('next');
const resultPage = document.querySelector('.result__page')

let selectedOption = document.querySelector('.selected');

let alreadyDoneQuestions = [];
let actualQuestion = 1;
let correctAnswers = 0;
let finalPercentage;
let actualQuestionObject;
let questionCategory;
let totalQuestions;


categoryButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.classList[0];
    questionCategory = category;

    fetch('./data/questions_data.json')
      .then((res) => res.json())
      .then((json) => {
        totalQuestions = json.filter((item) => item.category === category).length;

      })

    startQuiz(category);
  });
});

const getRandomQuestion = async (category) => {
  try {
    const response = await fetch('./data/questions_data.json');
    const data = await response.json();
    const filteredQuestions = data.filter((question) => question.category === category);
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const question = filteredQuestions[randomIndex];
    if (alreadyDoneQuestions.includes(question.id)) {
      return getRandomQuestion(category);
    }
    alreadyDoneQuestions.push(question.id);
    actualQuestionObject = question;
    return question;
  } catch (error) {
    console.error(error);
  }
};

const startQuiz = (category) => {
  initialPage.classList.add('hide');
  questionPage.classList.remove('hide');
  console.log(`Quiz sobre ${category} iniciado`);
  getRandomQuestion(category)
    .then((question) => {
      initializeQuestion(question);
    });


};

const initializeQuestion = (question) => {
  questionTitle.textContent = `Questão ${actualQuestion}/${totalQuestions}`;
  questionCommand.textContent = question.title;
  questionOptions.forEach((q, index)=>{

    q.textContent = Object.values(question.options)[index]
  })

}
const handleOptionsButtonsClick = ()=>{

  questionOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
  
      questionOptions.forEach(option => {
        option.classList.remove('selected');
        option.style.backgroundColor = "#FFF455"; 

        selectedOption = btn;
      });
  
      btn.classList.add('selected');
      
      btn.style.backgroundColor = "#FFC700";
  
    });
  });
}

const checkAnswer = (actualQuestionObject) => {
  return getKeyByValue(actualQuestionObject.options, selectedOption.textContent).join('') === actualQuestionObject.correctOption;
};

const handleNextButtonClick = ()=>{

  nextButton.addEventListener('click', ()=>{
    if(actualQuestion === totalQuestions) {
      if(checkAnswer(actualQuestionObject)) correctAnswers++;

      finalPercentage = ((correctAnswers/totalQuestions)*100).toFixed(2);

      if(finalPercentage >= 50){
        resultPage.querySelector('h1').textContent = `Parabéns! Acertaste ${finalPercentage}% das questões! (${correctAnswers}/${totalQuestions})`
      }else if(finalPercentage==0){
        resultPage.querySelector('h1').textContent = `Não acertaste nada...`;
      }
      
      else{
        resultPage.querySelector('h1').textContent = `Acertaste apenas ${finalPercentage}% das questões... (${correctAnswers}/${totalQuestions})`
      }
      
      console.log(`Voce termimou o quiz! \n sua pontuação: ${correctAnswers}/${totalQuestions}`)
      correctAnswers = 0;
      questionPage.classList.add('hide')
      resultPage.classList.remove('hide')
      alreadyDoneQuestions = [];
      actualQuestion = 1;
      clearSelected();
      questionCategory = null;
      return;
    }

    if(checkAnswer(actualQuestionObject)) correctAnswers++;


    actualQuestion++
    clearSelected()
    getRandomQuestion(questionCategory)
    .then((question) => {
      initializeQuestion(question);
    });
  })

const clearSelected = ()=>{
  questionOptions.forEach((f)=>{
    f.style.backgroundColor = "#FFF455"; 
  })
  selectedOption.classList.remove('selected')
}


}
function getKeyByValue(obj, value) {
  return Object.keys(obj)
    .filter(key => obj[key] === value);
}

handleOptionsButtonsClick()
handleNextButtonClick()