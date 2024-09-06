const evtSource = new EventSource("/count");
const ti = document.querySelector('input');

evtSource.onmessage = (event) => {
  ti.value = event.data;
};

document.querySelector('button').addEventListener('click', async () => {
  await fetch('/count', {
    method: "POST",
    body: JSON.stringify({ value: ti.value }),
    contentType: 'application/json',
  });
});