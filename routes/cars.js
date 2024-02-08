const userRoutes = (app, fs) => {

	const dataPath = './Car_Filling_Station.json';

	// helper methods
	const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
			fs.readFile(filePath, encoding, (err, data) => {
					if (err) {
							throw err;
					}

					callback(returnJson ? JSON.parse(data) : data);
			});
	};

	const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

			fs.writeFile(filePath, fileData, encoding, (err) => {
					if (err) {
							throw err;
					}

					callback();
			});
	};

	// READ
	app.get('/stations', (req, res) => {
			fs.readFile(dataPath, 'utf8', (err, data) => {
					if (err) {
							throw err;
					}

					res.send(JSON.parse(data));
			});
	});

	// CREATE
	app.post('/stations', (req, res) => {

			readFile(data => {
					const newUserId = Date.now().toString();

					// add the new user
					data[newUserId.toString()] = req.body;

					writeFile(JSON.stringify(data, null, 2), () => {
							res.status(200).send('new station added');
					});
			},
					true);
	});

	// READ with Pagination and Custom Limit
	app.get('/stationsPage', (req, res) => {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		readFile(data => {
				const startIndex = (page - 1) * limit;
				const endIndex = page * limit;

				const stations = data.slice(startIndex, endIndex);

				res.send(stations);
		}, true);
	});


	// READ by ID
	app.get('/stations/:id', (req, res) => {
		const stationId = req.params.id;

		readFile(data => {
				const station = data.find(station => station.Station_ID === parseInt(stationId));
				if (!station) {
						res.status(404).send('Station not found');
				} else {
						res.send(station);
				}
		}, true);
	});

	// UPDATE
	app.put('/stations/:id', (req, res) => {

			readFile(data => {

					// add the new user
					const userId = req.params["Station_ID"];
					data[userId] = req.body;

					writeFile(JSON.stringify(data, null, 2), () => {
							res.status(200).send(`station id:${userId} updated`);
					});
			},
					true);
	});

	// DELETE
	app.delete('/stations/:id', (req, res) => {
			readFile(data => {

					// delete the user
					const userId = req.params["Station_ID"];
					delete data[userId];

					writeFile(JSON.stringify(data, null, 2), () => {
							res.status(200).send(`stations id:${userId} removed`);
					});
			},
					true);
	});
};

module.exports = userRoutes;