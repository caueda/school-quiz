(function () {
  'use strict';

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = items => items[rand(0, items.length - 1)];
  const shuffle = items => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const money = cents => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  const decimal = (value, digits) => (value / (10 ** digits)).toFixed(digits).replace('.', ',');
  const bar = (parts, filled) => `<div class="fraction-bar" role="img" aria-label="${filled} de ${parts} partes iguais pintadas">${Array.from({ length: parts }, (_, i) => `<span class="${i < filled ? 'filled' : ''}"></span>`).join('')}</div><div class="fraction-caption">${filled} de ${parts} partes iguais</div>`;
  const numberOptions = (answer, offsets = [-2, -1, 1, 2, 3]) => {
    const values = new Set([answer]);
    for (const offset of shuffle(offsets)) if (answer + offset >= 0) values.add(answer + offset);
    for (let n = 1; values.size < 4; n++) values.add(answer + n + 4);
    return shuffle([...values].slice(0, 4).map(String));
  };
  const question = (topic, prompt, answer, options, hint, explanation, visual = '') => ({ topic, prompt, answer: String(answer), options: shuffle(options.map(String)), hint, explanation, visual });

  function unknown() {
    const type = rand(0, 3), a = rand(3, 12), x = rand(2, 10);
    if (type === 0) return question('Igualdades e incógnitas', `Qual número completa a igualdade? □ + ${a} = ${a + x}`, x, numberOptions(x), 'Pense: quanto falta somar ao número conhecido para chegar ao total?', `Tire ${a} do total: ${a + x} − ${a} = ${x}.`);
    if (type === 1) return question('Igualdades e incógnitas', `Qual número completa a igualdade? □ − ${a} = ${x}`, a + x, numberOptions(a + x), 'Se você tirou uma parte, junte-a de volta para descobrir o começo.', `Some ${a} + ${x} = ${a + x}.`);
    if (type === 2) return question('Igualdades e incógnitas', `Qual número completa a igualdade? ${a} × □ = ${a * x}`, x, numberOptions(x), 'Use a operação inversa: divida o resultado pelo número conhecido.', `${a * x} ÷ ${a} = ${x}.`);
    return question('Igualdades e incógnitas', `Qual número completa a igualdade? ${a * x} ÷ □ = ${a}`, x, numberOptions(x), 'Pergunte: por qual número divido o total para obter o resultado?', `${a} × ${x} = ${a * x}; por isso o número escondido é ${x}.`);
  }

  function operations() {
    const type = rand(0, 3), a = rand(12, 48), b = rand(6, 29);
    if (type === 0) return question('Operações', `Quanto é ${a} + ${b}?`, a + b, numberOptions(a + b, [-10, -2, -1, 1, 2, 10]), 'Some as dezenas e depois as unidades.', `${a} + ${b} = ${a + b}.`);
    if (type === 1) return question('Operações', `Quanto é ${a + b} − ${b}?`, a, numberOptions(a, [-10, -2, -1, 1, 2, 10]), 'A subtração desfaz uma adição.', `${a + b} − ${b} = ${a}.`);
    const m = rand(3, 9), n = rand(2, 8);
    if (type === 2) return question('Operações', `Quanto é ${m} × ${n}?`, m * n, numberOptions(m * n, [-n, -1, 1, n, n + 1]), `Pense em ${n} grupos de ${m}.`, `${m} × ${n} = ${m * n}.`);
    return question('Operações', `Quanto é ${m * n} ÷ ${m}?`, n, numberOptions(n), `Que número multiplicado por ${m} dá ${m * n}?`, `${m} × ${n} = ${m * n}, então ${m * n} ÷ ${m} = ${n}.`);
  }

  function balance() {
    const boxes = rand(1, 3), each = rand(2, 8), extra = rand(1, 7), total = boxes * each + extra;
    const left = `${'📦 '.repeat(boxes)} + ${extra} kg`, right = `${total} kg`;
    const visual = `<div class="balance" role="img" aria-label="Balança equilibrada: ${boxes} caixa${boxes > 1 ? 's' : ''} e ${extra} quilogramas de um lado; ${total} quilogramas do outro"><div class="balance-beam"></div><div class="balance-pans"><div>${left}</div><div>${right}</div></div><div class="balance-center">⚖</div></div>`;
    return question('Balanças', `A balança está equilibrada. Quanto pesa cada caixa?`, `${each} kg`, numberOptions(each).map(n => `${n} kg`), `Retire ${extra} kg dos dois lados. Depois divida o que sobrou pelas ${boxes} caixa${boxes > 1 ? 's' : ''}.`, `${total} − ${extra} = ${boxes * each} kg. ${boxes * each} ÷ ${boxes} = ${each} kg por caixa.`, visual);
  }

  function unitFractions() {
    const parts = pick([2, 3, 4, 5, 6, 8, 10]);
    const alternatives = [...new Set([`1/${parts}`, `1/${parts + 1}`, `${parts}/1`, `2/${parts}`, `${parts - 1}/${parts + 1}`])].slice(0, 4);
    return question('Frações unitárias', `Uma parte de ${parts} partes iguais foi pintada. Que fração ela representa?`, `1/${parts}`, alternatives, 'Fração unitária tem 1 no numerador. O denominador conta todas as partes iguais.', `1 parte pintada entre ${parts} partes iguais é 1/${parts}.`, bar(parts, 1));
  }

  function representations() {
    const parts = pick([4, 5, 6, 8, 10]), filled = rand(2, parts - 1);
    const alternatives = [...new Set([`${filled}/${parts}`, `${parts}/${filled}`, `${filled - 1}/${parts}`, `${filled}/${parts + 1}`, `${filled + 1}/${parts}`])].slice(0, 4);
    return question('Representação de frações', 'Que fração mostra a parte pintada da barra?', `${filled}/${parts}`, alternatives, 'Conte as partes pintadas para o número de cima e todas as partes para o número de baixo.', `São ${filled} partes pintadas de um total de ${parts}: ${filled}/${parts}.`, bar(parts, filled));
  }

  function numberLine() {
    const parts = pick([4, 5, 6, 8]), point = rand(1, parts - 1);
    const visual = `<div class="number-line" role="img" aria-label="Reta de zero a um dividida em ${parts} partes iguais; ponto de interrogação na marca ${point}">${Array.from({ length: parts + 1 }, (_, i) => `<div class="tick ${i === point ? 'mark' : ''}">${i === 0 ? '0' : i === parts ? '1' : ''}</div>`).join('')}</div>`;
    const alternatives = [...new Set([`${point}/${parts}`, `${parts}/${point}`, `${Math.max(1, point - 1)}/${parts}`, `${Math.min(parts, point + 1)}/${parts}`, `${point}/${parts + 1}`])].slice(0, 4);
    return question('Reta numérica', 'Qual fração está no ponto marcado com ? na reta?', `${point}/${parts}`, alternatives, 'Conte quantos pulos iguais há do 0 ao 1. Depois conte os pulos até o ponto.', `Do 0 ao 1 há ${parts} partes iguais. O ponto está após ${point} ${point === 1 ? 'pulo' : 'pulos'}: ${point}/${parts}.`, visual);
  }

  function compareFractions() {
    let left, right, reason;
    if (rand(0, 1) === 0) {
      const d = pick([4, 5, 6, 8]), n = rand(1, d - 1), m = rand(1, d - 1);
      left = [n, d]; right = [m, d]; reason = `Com o mesmo denominador (${d}), compare os numeradores: ${n} e ${m}.`;
    } else {
      const d = pick([2, 3, 4, 5, 6]), e = pick([2, 3, 4, 5, 6, 8]);
      left = [1, d]; right = [1, e]; reason = 'Quando o numerador é 1, menos partes no inteiro significam pedaços maiores.';
    }
    const a = left[0] * right[1], b = right[0] * left[1], answer = a < b ? '<' : a > b ? '>' : '=';
    const l = `${left[0]}/${left[1]}`, r = `${right[0]}/${right[1]}`;
    return question('Comparação de frações', `Qual sinal deixa a comparação correta? ${l} __ ${r}`, answer, ['<', '>', '='], 'Imagine dois inteiros do mesmo tamanho e compare o tamanho das partes.', `${l} ${answer} ${r}. ${reason}`, `<div class="comparison" aria-hidden="true"><div>${l}</div><span>?</span><div>${r}</div></div>`);
  }

  function decimals() {
    if (rand(0, 1) === 0) {
      const n = rand(2, 8), answer = decimal(n, 1);
      const options = [...new Set([n, n - 1, n + 1, 10 - n, n + 2])].slice(0, 4).map(x => decimal(x, 1));
      return question('Números decimais', `Como escrevemos ${n}/10 em número decimal?`, answer, options, 'Dez partes no inteiro indicam décimos. Use um algarismo depois da vírgula.', `${n}/10 corresponde a ${answer}: ${n} décimos.`, bar(10, n));
    }
    const n = pick([12, 24, 35, 46, 57, 68, 79, 83]);
    const options = [n, n - 10, n + 10, n + 1].map(x => decimal(x, 2));
    return question('Números decimais', `Como escrevemos ${n}/100 em número decimal?`, decimal(n, 2), options, 'Cem partes no inteiro indicam centésimos. Use dois algarismos depois da vírgula.', `${n}/100 corresponde a ${decimal(n, 2)}: ${n} centésimos.`);
  }

  function moneyQuestion() {
    if (rand(0, 1) === 0) {
      const a = pick([50, 100]), b = pick([25, 50, 100]), total = a + b;
      const options = [total, total + 50, Math.max(0, total - 25), total + 100].map(money);
      const visual = `<div class="coins" role="img" aria-label="Duas moedas ou cédulas nos valores ${money(a)} e ${money(b)}"><div class="coin">${money(a)}</div><div class="coin">${money(b)}</div></div>`;
      return question('Dinheiro brasileiro', `Quanto vale tudo junto?`, money(total), options, 'Some os reais e os centavos. Lembre: 100 centavos formam 1 real.', `${money(a)} + ${money(b)} = ${money(total)}.`, visual);
    }
    const paid = pick([500, 1000, 2000]), price = paid - pick([125, 150, 200, 250, 300]);
    const change = paid - price;
    const options = [change, change + 50, change - 50, change + 100].map(money);
    return question('Dinheiro brasileiro', `Uma compra custa ${money(price)}. Você paga com ${money(paid)}. Qual é o troco?`, money(change), options, 'Troco é o que sobra: valor pago menos preço da compra.', `${money(paid)} − ${money(price)} = ${money(change)}.`);
  }

  const generators = [unknown, operations, balance, unitFractions, representations, numberLine, compareFractions, decimals, moneyQuestion];
  function newRound() {
    const chosen = [...generators, ...Array.from({ length: 3 }, () => pick(generators))];
    const seen = new Set();
    const questions = chosen.map(make => {
      let item, key, attempts = 0;
      do {
        item = make(); key = `${item.topic}|${item.prompt}|${item.answer}`;
        attempts++;
      } while (seen.has(key) && attempts < 30);
      seen.add(key);
      return item;
    });
    return shuffle(questions);
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { generators, newRound };
  if (typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  let round = [], index = 0, points = 0, answered = false, topicScores = {};
  const show = id => $(id).classList.remove('hidden');
  const hide = id => $(id).classList.add('hidden');

  function start() {
    round = newRound(); index = 0; points = 0; answered = false; topicScores = {};
    hide('welcome'); hide('finish'); show('game'); render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    answered = false;
    const q = round[index];
    $('count').textContent = `Desafio ${index + 1} de ${round.length}`;
    $('score').textContent = `⭐ ${points} ${points === 1 ? 'ponto' : 'pontos'}`;
    $('progress').setAttribute('aria-valuemax', String(round.length));
    $('progress').setAttribute('aria-valuenow', String(index));
    $('progress-fill').style.width = `${index / round.length * 100}%`;
    $('topic').textContent = q.topic;
    $('question-heading').textContent = q.prompt;
    $('visual').innerHTML = q.visual;
    $('options').replaceChildren();
    for (const option of q.options) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'option'; button.textContent = option;
      button.addEventListener('click', () => answer(option));
      $('options').append(button);
    }
    $('hint').textContent = q.hint; hide('hint'); show('hint-button');
    $('feedback').replaceChildren(); hide('feedback'); hide('next');
    $('question-heading').focus({ preventScroll: true });
  }

  function answer(chosen) {
    if (answered) return;
    answered = true;
    const q = round[index], correct = chosen === q.answer;
    if (!topicScores[q.topic]) topicScores[q.topic] = { right: 0, total: 0 };
    topicScores[q.topic].total++;
    if (correct) { points++; topicScores[q.topic].right++; }
    $('score').textContent = `⭐ ${points} ${points === 1 ? 'ponto' : 'pontos'}`;
    for (const button of $('options').children) {
      button.disabled = true;
      if (button.textContent === q.answer) button.classList.add('correct');
      else if (button.textContent === chosen) button.classList.add('wrong');
    }
    const title = document.createElement('strong');
    title.textContent = correct ? 'Muito bem! 🌟' : `Quase lá! A resposta é ${q.answer}.`;
    const detail = document.createElement('span'); detail.textContent = q.explanation;
    $('feedback').append(title, detail);
    $('feedback').classList.toggle('no', !correct); show('feedback');
    hide('hint-button');
    $('next').firstChild.textContent = index === round.length - 1 ? 'Ver meu resultado ' : 'Próximo desafio ';
    show('next'); $('next').focus({ preventScroll: true });
  }

  function next() {
    if (!answered) return;
    index++;
    if (index < round.length) { render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    hide('game'); show('finish');
    $('final-points').textContent = String(points);
    $('finish-message').textContent = points >= 10 ? 'Você mandou muito bem! Continue explorando para descobrir ainda mais.' : points >= 6 ? 'Você avançou bastante! Uma nova partida vai ajudar a fortalecer o que aprendeu.' : 'Cada tentativa ensina algo novo. Leia as explicações e tente outra missão!';
    $('topic-results').replaceChildren();
    for (const [topic, result] of Object.entries(topicScores)) {
      const tile = document.createElement('div');
      const score = document.createElement('strong'); score.textContent = `${result.right}/${result.total}`;
      tile.append(score, document.createTextNode(topic)); $('topic-results').append(tile);
    }
    $('finish-title').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('start').addEventListener('click', start);
  $('restart').addEventListener('click', start);
  $('next').addEventListener('click', next);
  $('hint-button').addEventListener('click', () => { show('hint'); hide('hint-button'); });
  $('question-heading').tabIndex = -1;
  $('finish-title').tabIndex = -1;
})();
