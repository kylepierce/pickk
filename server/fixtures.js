if (QL.find().count() === 0) {
	QL.insert({
		question: 'Will the next play be a run?',
		author: 'kyle'
	});
}