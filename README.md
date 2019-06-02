# Easy Markov Chain

Easy to use Markov Chain generator without any external dependencies.

## Installing


```
npm install easy-markov-chain
```

## Usage

```javscript
const chain = require('easy-markov-chain')

let messages = [ … ] // an array of messages, sentences, strings

for (message of messages) {
    chain.learn(message)
}

chain.normalize()

console.log(chain.generate(10))
```

