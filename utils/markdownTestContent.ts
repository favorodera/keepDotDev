export default function (): string {
  return `
# Markdown Editor Test File

## Headers

# H1 Header

## H2 Header

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

---

## Emphasis

* *Italic* using \`*\`
* *Italic* using \`_\`
* **Bold** using \`**\`
* **Bold** using \`__\`
* ***Bold and Italic***
* ~~Strikethrough~~

---

## Lists

### Unordered List

* Item 1

  * Subitem 1.1
  * Subitem 1.2
* Item 2

### Ordered List

1. First item
2. Second item

   1. Subitem 2.1
   2. Subitem 2.2

---

## Links and Images

[Github Avatar](https://avatars.githubusercontent.com/u/145864896?v=4)

![Github Avatar](https://avatars.githubusercontent.com/u/145864896?v=4)

---

## Code

Inline code: \`console.log('Hello World')\`

### Block code (with language syntax highlighting):

\`\`\`js
function greet(name) {
  return \`Hello, \${name}\`;
}
\`\`\`

\`\`\`python
def greet(name):
    return f"Hello, {name}"
\`\`\`

---

## Blockquote

> "Markdown is not a replacement for HTML, but a tool for writing in plain text format."
> — John Gruber

---

## Horizontal Rule

---

## Tables

| Name    | Age | Occupation   |
| ------- | --- | ------------ |
| Alice   | 30  | Developer    |
| Bob     | 25  | Designer     |
| Charlie | 35  | Product Lead |

---

## Task Lists

* [x] Write markdown test file
* [ ] Test markdown editor
* [ ] Fix bugs if any

---

## HTML in Markdown

<b>Bold using HTML</b><br> <i>Italic using HTML</i><br> <code>Inline code with HTML</code>

---

## Emoji

Markdown supports emoji on some platforms:

* 😄 🎉 👍 💻 📚 🔥

---

## Footnotes

Here's a sentence with a footnote.[^1]

[^1]: This is the footnote.

---

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2

---

## Abbreviations

Markdown
*[Markdown]: A lightweight markup language
  `
}
