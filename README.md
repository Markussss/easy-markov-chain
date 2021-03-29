# Easy Markov Chain

Easy to use Markov Chain generator without any external dependencies.

## Installing


```
npm install easy-markov-chain
```

## Usage

```javscript
import Chain from 'easy-markov-chain';

const chain = new Chain();

let messages = [ … ] // an array of messages, sentences, strings

for (let message of messages) {
    chain.learn(message)
}

chain.normalize()

console.log(chain.generate(10))
```
