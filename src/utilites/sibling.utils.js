import RootSiblings from 'react-native-root-siblings'

let siblings = []

export const showSibling = (item, isNested) => {
    if (!isNested) {
        for (let i = 0; i < siblings.length; i++) {
            siblings[i].destroy()
        }
        siblings = []
    }
    siblings.push(new RootSiblings(item))
}

export const isSiblingVisible = () => {
    return siblings.length ? true : false
}

export const destroySibling = () => {
    let lastSibling = siblings.pop();
    lastSibling && lastSibling.destroy();
}