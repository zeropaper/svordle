<script lang="ts">
  // TODO: find pageid with https://en.wiktionary.org/w/api.php?action=query&titles=<word>&prop=revisions&rvprop=content&rvgeneratexml=&format=json to query https://en.wikipedia.org/wiki/Special:ApiSandbox#action=parse&format=json&pageid=<pageid>
  import words from './lib/words'
  import { Guesses, Guess } from './lib/guesses'
  const word = words.at(Math.floor(Math.random() * words.length))
  const wordExists = (search: string) => words.includes(search);

  const maxGuesses = 5;
  const makeEmptyGuess = (l = 5) => new Array(l).fill('')
  let wordFound = false
  let guesses: Guesses = []
  let remainingGuesses: Guesses = new Array(maxGuesses - (guesses.length + 1)).fill(makeEmptyGuess())
  let currentGuess: Guess = makeEmptyGuess()
  
  /* 
  const init = () => {
    wordFound = false
    guesses = []
    remainingGuesses = new Array(maxGuesses - (guesses.length + 1)).fill(makeEmptyGuess())
    currentGuess = makeEmptyGuess()
  }
  */
  
  let keyboard = [
    'qwertzuiop'.split(''),
    'asdfghjkl'.split(''),
    'yxcvbnm'.split(''),
  ]

  const keys = keyboard.reduce((acc, val) => [...acc, ...val], [])

  const letterClass = (letter: string, index: number) => {
    if (!letter || !word.includes(letter)) return null;
    if (word[index] === letter) return 'match'
    return 'wrong'
  }

  const keyIsUsed = (key: string) => {
    for (let g = 0; g < guesses.length; g += 1) {
      if (guesses[g].includes(key)) return true
    }
    return false
  }
  const keyClass = (key: string) => {
    const used = keyIsUsed(key)
    if (used) {
      const lastGuess = guesses.at(-1)
      for (let l = 0; l < 5; l += 1) {
        if (lastGuess[l] === word[l] && key === word[l]) return 'match'
      }
      if (word.includes(key)) return 'wrong'
      return 'used'
    }
    return null
  }

  const addLetter = (letter: string) => {
    if (wordFound) return
    for (let i = 0; i < maxGuesses; i += 1) {
      if (!currentGuess[i]) {
        currentGuess[i] = letter
        return;
      }
    }
  }

  const checkGuess = () => {
    if (guesses.length > maxGuesses - 1) return
    const currentWord = currentGuess.join('')
    if (!wordFound) wordFound = word === currentWord
    if (!wordExists(currentWord)) return
    guesses.push(currentGuess)
    guesses = guesses
    if (wordFound) return
    keyboard = keyboard
    currentGuess = makeEmptyGuess()
    if (guesses.length > maxGuesses - 1) return 
    remainingGuesses = new Array(maxGuesses - (guesses.length + 1)).fill(makeEmptyGuess())
  }

  const backspace = () => {
    const kept = currentGuess.filter(Boolean)
    kept.pop()
    currentGuess = [...kept, ...makeEmptyGuess(5 - kept.length)]
  }

  window.addEventListener('keyup', ({ key }) => {
    if (key.toLowerCase() === 'enter' && !currentGuess.includes('')) {
      checkGuess()
      return;
    } 
    if (key.toLowerCase() === 'backspace') {
      backspace()
      return
    }
    
    if (!keys.includes(key)) return;
    addLetter(key)
  })
</script>

<dialog open={wordFound || !(maxGuesses - guesses.length)}>
  <div>{word}</div>
</dialog>

<table>
  <tbody>
    {#each guesses as guess}
    <tr class="used">
      {#each guess as letter, index}
      <td class="{letterClass(letter, index)}">{letter}</td>
      {/each}
    </tr>
    {/each}

    {#if maxGuesses - guesses.length > 0}
      {#if !wordFound}
      <tr class="current">
        <td>{currentGuess[0]}</td>
        <td>{currentGuess[1]}</td>
        <td>{currentGuess[2]}</td>
        <td>{currentGuess[3]}</td>
        <td>{currentGuess[4]}</td>
      </tr>
      {/if}
    {/if}

    {#if maxGuesses - guesses.length > 1}
      {#each remainingGuesses as guess}
      <tr class="remaining">
        {#each guess as letter}
        <td></td>
        {/each}
      </tr>
      {/each}
    {/if}
  </tbody>
</table>

<div class="attempts">{`${maxGuesses - guesses.length} attempts left`}</div>

<div class="keyboard">
  <button on:click={backspace}>meh</button>
  <div class="rows">
    {#each keyboard as row}
    <div>
      {#each row as key}
        <button class={keyClass(key)} on:click={() => addLetter(key)}>{key}</button>
      {/each}
    </div>
    {/each}
  </div>
  <button on:click={checkGuess}>Enter</button>
</div>

<style>
:root {
  font-family: sans-serif;
}
* {
  box-sizing: border-box;
}
table {
  margin: auto;
}
.used {
  background: #aaa
}
.current {
  background: #ddd
}
td {
  text-align: center;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  padding: 0;
  text-transform: uppercase;
  border: 1px solid #333;
}
.attempts {
  margin-bottom: 4px;
  text-align: center;
}
button {
  text-transform: uppercase;
}
.match {
  color: white;
  background: green
}
.wrong {
  color: white;
  background: orange
}
.keyboard {
  display: flex;
  justify-content: center;
  align-items: center;
}
.keyboard > button {
  aspect-ratio: 1 / 1;
}
.rows {
  display: flex;
  flex-direction: column;
  margin: 0 2px
}
.rows div {
  display: flex;
  margin: auto;
}
.rows div:not(:last-of-type) {
  margin-bottom: 2px
}

.rows button {
  text-align: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #333;
  border-radius: 3px;
}
.rows button:not(:last-of-type) {
  margin-right: 2px;
}
.rows button.used:not(.wrong),
.rows button.used:not(.match) {
  opacity: 0.5
}
.rows button.wrong,
.rows button.match {
  color: white
}
.rows button.wrong {
  background: orange
}
.rows button.match {
  background: green
}
</style>