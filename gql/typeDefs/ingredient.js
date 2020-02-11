import Node from './Node'

module.exports = `
    type Ingredient implements Node {
        id: Int!
        _id: String
        amount: String
        name: String
    }
`