fetch('http://127.0.0.1:6001/api/v1/tasks/placeholder', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    columnId: "fake-id",
    position: null
  })
}).then(res => res.text()).then(console.log).catch(console.error);
