var chain = {
    /**
     * Add all words in this message to the chain
     *
     * @param {string} message
     */
    learn(message) {
        let lastWord
        message = usefullMessage(message)
        if (message.length > 0) {
            message.trim().replace(/ +/g, ' ').split(' ').forEach(word => {
                this.addWord(lastWord, word)
                lastWord = word
            })
        }
        lastWord = undefined
    },
    /**
     * Normalize the chain
     */
    normalize() {
        let total = 0
        for (let word in chain) {
            total = 0
            if (typeof chain[word] === 'function') continue
            let sum = Object.keys(chain[word]).reduce((sum, cur) => {
                return sum + chain[word][cur]
            }, 0)
            for (let nextWord in chain[word]) {
                chain[word][nextWord] = ((chain[word][nextWord] / sum) * 100)
                total += chain[word][nextWord]
                chain[word][nextWord] = total
            }
        }
    },
    /**
     * Add word2 to the chain after word1
     *
     * @param {string} word1
     * @param {string} word2
     */
    addWord(word1, word2) {
        if (!word1 || !word2) return
        if (!chain[word1]) {
            chain[word1] = {}
        }
        if (!chain[word1][word2]) {
            chain[word1][word2] = 0
        }
        chain[word1][word2] += 1
    },
    /**
     * Get the next word in the chain, based on the current word
     *
     * @param {string} word
     */
    getNextWord(word) {
        if (!chain[word]) {
            return
        }
        let n = randNum(0, 100)
        return Object.keys(chain[word]).find(cur => {
            return (chain[word][cur] > n)
        })
    },
    /**
     * Generate a string of words from the chain up to at most this length. Start from the startWord
     * @param {number} length
     * @param {string} startWord
     */
    generate(length, startWord) {
        let possibleStartWords = [startWord]
        if (startWord && startWord.length > 4) {
            possibleStartWords = Object.keys(chain).filter(word => word.indexOf(startWord) === 0)
        }
        startWord = possibleStartWords[randNum(0, possibleStartWords.length - 1)]

        let curWord = startWord
        while (!curWord || typeof chain[curWord] === 'function') {
            curWord = Object.keys(chain)[Math.round(Math.random() * Object.keys(chain).length - 1)]
        }

        let res = curWord
        let nextWord
        for (;length > 0; length--) {
            nextWord = this.getNextWord(curWord)
            if (nextWord === curWord) nextWord = this.getNextWord(startWord)
            if (!nextWord) return res
            res += ' ' + nextWord
            curWord = nextWord
        }
        return res
    }
}

/**
 * Get a random number between min and max, inclusive.
 *
 * @param {number} min
 * @param {number} max
 */
function randNum (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Removing some things I found problematic when generating chains
 *
 * @param {String} str
 */
function usefullMessage (str) {
    if (str.match(/\b(\w+)\s+\1\b/)) {
        str = str.replace(/(\b(\w+))\s+\1\b/, '$1')
    }
    if (str.indexOf('http') > -1) return ''

    return str
        .replace(/<.*>/g, ' ')
        .replace(/:.*:/g, ' ')
        .replace(/[^a-zA-ZæøåÆØÅ./\-(),!?=&\s]+/g, ' ')
        .replace(/^[.:/\-(),!?=&\s]+/g, ' ')
        .replace(/[\r\n]/g, ' ')
        .replace(/ +/g, ' ')
        .trim()
        .toLowerCase()
}

module.exports = chain
