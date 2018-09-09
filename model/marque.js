/*jshint esversion :  6 */

// @root/model/marque.js

const marqueModel = function marqueModel(connection) {

  const create = function createMarque(clbk, data) {
    const q = "INSERT INTO marque (name, lastname, email) VALUES (?, ?, ?)";
      console.log("voila");
    const payload = [data.name, data.lastname, data.email];

    connection.query(q, payload, (err, res, cols) => {
      // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
  };

  const remove = function deleteMarque(clbk, ids) {
    // la clause SQL IN permet de chercher une valeur dans un tableau
    const q = "DELETE FROM marque WHERE id IN (?)";

    connection.query(q, [ids], function (err, res, fields) {
      // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (err) return clbk(res, null);
      return clbk(null, res);
    });
  };

  const update = function editMarque(clbk, marque) {
    const q = "UPDATE marque SET name = ?, lastname = ?, email = ? WHERE id = ?";
    const payload = [marque.name, marque.lastname, marque.email, marque.id];
    connection.query(q, payload, function (err, res, fields) {
      // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
  };

  const get = function getMarque(clbk, id) {
    var sql;

    if (id && !isNaN(id)) {
      sql = "SELECT * FROM marque WHERE id = ?";
    } else {
      sql = "SELECT * FROM marque";
    }

    connection.query(sql, [id], (error, results, fields) => {
       console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (error) return clbk(error, null);
      return clbk(null, results);
    });
  };

  return {
    create,
    remove,
    update,
    get
  };
};

module.exports = marqueModel;


///* jshint esversion : 6 */
//
//// @root/model/country.js
//
//const marqueModel = function marqueModel(connection) {
//
//  return {};
//};
//
//module.exports = marqueModel;
