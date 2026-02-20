import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  await prisma.attemptAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();

  console.log('cleaned data');

  await prisma.quiz.create({
    data: {
      title: 'Continentes do Mundo',
      description: 'Teste seus conhecimentos sobre em qual continente cada país está localizado.',
      category: 'continents',
      questions: {
        create: [
          {
            text: 'Em qual continente fica o Japão?',
            answers: { create: [{ text: 'Ásia', isCorrect: true }, { text: 'Europa', isCorrect: false }, { text: 'Oceania', isCorrect: false }, { text: 'África', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica o Brasil?',
            answers: { create: [{ text: 'América do Sul', isCorrect: true }, { text: 'América do Norte', isCorrect: false }, { text: 'África', isCorrect: false }, { text: 'Europa', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica a Nigéria?',
            answers: { create: [{ text: 'África', isCorrect: true }, { text: 'Ásia', isCorrect: false }, { text: 'América do Sul', isCorrect: false }, { text: 'Europa', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica a Austrália?',
            answers: { create: [{ text: 'Oceania', isCorrect: true }, { text: 'Ásia', isCorrect: false }, { text: 'América do Norte', isCorrect: false }, { text: 'África', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica o Canadá?',
            answers: { create: [{ text: 'América do Norte', isCorrect: true }, { text: 'Europa', isCorrect: false }, { text: 'América do Sul', isCorrect: false }, { text: 'Oceania', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica a Alemanha?',
            answers: { create: [{ text: 'Europa', isCorrect: true }, { text: 'Ásia', isCorrect: false }, { text: 'América do Norte', isCorrect: false }, { text: 'África', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica a Argentina?',
            answers: { create: [{ text: 'América do Sul', isCorrect: true }, { text: 'Europa', isCorrect: false }, { text: 'América do Norte', isCorrect: false }, { text: 'Oceania', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica o Egito?',
            answers: { create: [{ text: 'África', isCorrect: true }, { text: 'Ásia', isCorrect: false }, { text: 'Europa', isCorrect: false }, { text: 'América do Sul', isCorrect: false }] },
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Capitais do Mundo',
      description: 'Você sabe qual é a capital de cada país? Teste seus conhecimentos!',
      category: 'countries',
      questions: {
        create: [
          {
            text: 'Qual é a capital do Japão?',
            answers: { create: [{ text: 'Tóquio', isCorrect: true }, { text: 'Osaka', isCorrect: false }, { text: 'Seul', isCorrect: false }, { text: 'Pequim', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital da Austrália?',
            answers: { create: [{ text: 'Camberra', isCorrect: true }, { text: 'Sydney', isCorrect: false }, { text: 'Melbourne', isCorrect: false }, { text: 'Brisbane', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital do Brasil?',
            answers: { create: [{ text: 'Brasília', isCorrect: true }, { text: 'São Paulo', isCorrect: false }, { text: 'Rio de Janeiro', isCorrect: false }, { text: 'Salvador', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital da África do Sul?',
            answers: { create: [{ text: 'Pretória', isCorrect: true }, { text: 'Joanesburgo', isCorrect: false }, { text: 'Cidade do Cabo', isCorrect: false }, { text: 'Durban', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital do Canadá?',
            answers: { create: [{ text: 'Ottawa', isCorrect: true }, { text: 'Toronto', isCorrect: false }, { text: 'Vancouver', isCorrect: false }, { text: 'Montreal', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital da Índia?',
            answers: { create: [{ text: 'Nova Délhi', isCorrect: true }, { text: 'Mumbai', isCorrect: false }, { text: 'Calcutá', isCorrect: false }, { text: 'Bangalore', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital da Argentina?',
            answers: { create: [{ text: 'Buenos Aires', isCorrect: true }, { text: 'Córdoba', isCorrect: false }, { text: 'Rosário', isCorrect: false }, { text: 'Mendoza', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital de Portugal?',
            answers: { create: [{ text: 'Lisboa', isCorrect: true }, { text: 'Porto', isCorrect: false }, { text: 'Braga', isCorrect: false }, { text: 'Coimbra', isCorrect: false }] },
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Geografia Mista',
      description: 'Um desafio completo de geografia: países, continentes e capitais misturados!',
      category: 'mixed',
      questions: {
        create: [
          {
            text: 'Qual é o maior país do mundo em extensão territorial?',
            answers: { create: [{ text: 'Rússia', isCorrect: true }, { text: 'China', isCorrect: false }, { text: 'Brasil', isCorrect: false }, { text: 'Estados Unidos', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica o México?',
            answers: { create: [{ text: 'América do Norte', isCorrect: true }, { text: 'América do Sul', isCorrect: false }, { text: 'América Central', isCorrect: false }, { text: 'Europa', isCorrect: false }] },
          },
          {
            text: 'Qual país possui a maior população do mundo?',
            answers: { create: [{ text: 'Índia', isCorrect: true }, { text: 'China', isCorrect: false }, { text: 'Estados Unidos', isCorrect: false }, { text: 'Indonésia', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica a Nova Zelândia?',
            answers: { create: [{ text: 'Oceania', isCorrect: true }, { text: 'Ásia', isCorrect: false }, { text: 'América do Norte', isCorrect: false }, { text: 'África', isCorrect: false }] },
          },
          {
            text: 'Qual é o menor país do mundo?',
            answers: { create: [{ text: 'Vaticano', isCorrect: true }, { text: 'Monaco', isCorrect: false }, { text: 'San Marino', isCorrect: false }, { text: 'Liechtenstein', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital da China?',
            answers: { create: [{ text: 'Pequim', isCorrect: true }, { text: 'Xangai', isCorrect: false }, { text: 'Hong Kong', isCorrect: false }, { text: 'Cantão', isCorrect: false }] },
          },
          {
            text: 'Em qual continente fica o Peru?',
            answers: { create: [{ text: 'América do Sul', isCorrect: true }, { text: 'América do Norte', isCorrect: false }, { text: 'Europa', isCorrect: false }, { text: 'África', isCorrect: false }] },
          },
          {
            text: 'Qual é a capital da Rússia?',
            answers: { create: [{ text: 'Moscou', isCorrect: true }, { text: 'São Petersburgo', isCorrect: false }, { text: 'Kiev', isCorrect: false }, { text: 'Varsóvia', isCorrect: false }] },
          },
        ],
      },
    },
  });

  console.log(' Seed done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
