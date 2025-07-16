import markdownItAnchor from 'markdown-it-anchor'
import markdownIt from 'markdown-it'


export default function () {
  const { $shikiHighlighter } = useNuxtApp()
  const { copy } = useClipboard({ legacy: true })

 
  const markdown = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (code, language?: string): string => {
      const codeId = `codeblock-${Math.random().toString(36).substring(2, 11)}`
      let langLabel = language || 'plaintext'
      let codeHtml = ''
      
      try {
        const grammar = language ? $shikiHighlighter.getLanguage(language) : null
        codeHtml = $shikiHighlighter.codeToHtml(code, { lang: language || 'plaintext', theme: 'ayu-dark' })
        langLabel = grammar ? grammar.name : langLabel
      } catch {
        codeHtml = $shikiHighlighter.codeToHtml(code, { lang: 'plaintext', theme: 'ayu-dark' })
      }
      
      const codeMatch = codeHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/)
      const codeContent = codeMatch ? codeMatch[1] : code
      
      return `
            <div class="code-block-container" data-lang="${langLabel}">
              <div class="code-block-header">
                <span class="code-block-lang">${langLabel}</span>
                <button class="code-block-copy" data-code-id="${codeId}" aria-label="Copy code" title="Copy code">Copy</button>
              </div>
              <pre id="${codeId}"><code class="shiki">${codeContent}</code></pre>
            </div>
          `
    },
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        symbol: '#',
        placement: 'before',
        class: 'heading-anchor',
        space: false,
      }),
      slugify: string => string.trim().toLowerCase().replace(/[^\w]+/g, '-'),
    })

  markdown.renderer.rules.fence = (tokens, index, options) => {
    const token = tokens[index]
    if (!token) return ''
    const code = token.content
    const language = (token.info ? token.info.trim().split(/\s+/g)[0] : '') || 'plaintext'
    return options.highlight ? options.highlight(code, language, '') : ''
  }


  function copyCodeBlock(event: Event) {

    const targetElement = event.target as HTMLElement | null

    if (!targetElement || !targetElement.classList.contains('code-block-copy')) return

    const codeId = targetElement.getAttribute('data-code-id')

    if (!codeId) return

    const codeElement = document.getElementById(codeId)

    if (!codeElement) return

    const codeText = codeElement.innerText

    try {

      copy(codeText)

      targetElement.innerText = 'COPIED!'
      targetElement.setAttribute('disabled', 'true')

      setTimeout(() => {
        targetElement.innerText = 'COPY'
        targetElement.removeAttribute('disabled')
      }, 1500)

    } catch {
      targetElement.innerText = 'FAILED!'
      setTimeout(() => targetElement.innerText = 'COPY', 1500)
    }

  }
  return {
    markdown,
    copyCodeBlock,
  }

}
