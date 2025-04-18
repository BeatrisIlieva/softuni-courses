function encodeAndDecodeMessages() {
    const buttonElements = document.querySelectorAll('button');
    const textareaElements = document.querySelectorAll('textarea');

    const encodeButtonElement = buttonElements[0];
    const decodeButtonElement = buttonElements[1];

    const encodeTextareaElement = textareaElements[0];
    const decodeTextareaElement = textareaElements[1];

    encodeButtonElement.addEventListener('click', e =>
        handleMessage(e, encodeTextareaElement, decodeTextareaElement, 1)
    );

    decodeButtonElement.addEventListener('click', e =>
        handleMessage(e, decodeTextareaElement, decodeTextareaElement, -1)
    );

    function handleMessage(e, sourceTextarea, targetTextarea, delta) {
        const input = sourceTextarea.value;

        if (input.length > 0) {
            const message = createMessage(input, delta);
            
            sourceTextarea.value = '';
            targetTextarea.value = message;
        }
    }

    function createMessage(text, delta) {
        return [...text].map(char => String.fromCharCode(char.charCodeAt(0) + delta)).join('');
    }
}
