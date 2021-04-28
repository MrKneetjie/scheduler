const test = (...params) => {
  console.log(params.slice(1));
};

test('a', 1, {foo: 'bar'});

