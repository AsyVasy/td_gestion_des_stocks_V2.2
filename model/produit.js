/*jshint esversion :  6 */

// @root/model/produit.js

const produitModel = function produitModel(connection) {

    const create = function createProduit(clbk, data) {
        const q = "INSERT INTO produit (nom, prix, description) VALUES (?, ?, ?)";
        console.log("voila");
        const payload = [data.nom, data.prix, data.description];

        connection.query(q, payload, (err, res, cols) => {
            console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(err, null);
            return clbk(null, res);
        });
    };



    const remove = function deleteProduit(clbk, ids) {
        // la clause SQL IN permet de chercher une valeur dans un tableau
        const q = "DELETE FROM produit WHERE id IN (?)";

        connection.query(q, [ids], function (err, res, fields) {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(res, null);
            return clbk(null, res);
        });
    };

    const update = function editProduit(clbk, produit) {
        const q = "UPDATE produit SET id = ? nom = ?, prix = ?, description = ? WHERE ";
        const payload = [produit.id, produit.nom, produit.prix, produit.description];
        connection.query(q, payload, function (err, res, fields) {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(err, null);
            return clbk(null, res);
        });
    };

    const get = function getProduit(clbk, id) {
        var sql;

        if (id && !isNaN(id)) {
            sql = "SELECT * FROM produit WHERE id = ?";
        } else {
            sql = "SELECT * FROM produit";
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

module.exports = produitModel;
