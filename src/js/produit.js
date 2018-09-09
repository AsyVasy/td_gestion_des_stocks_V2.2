///* global window*/
//
//var appProduit = (function appProduit() {
//    "use strict";
//    var domList;
//
//    var doAjax = function doAjax(url, method, callback, data) {
//        try {
//            const xhr = new XMLHttpRequest();
//            xhr.open(method, url);
//            xhr.setRequestHeader('Content-Type', 'application/json');
//            data = data ? JSON.stringify(data) : null;
//            if (method.toLowerCase() === "post") {
//                if (!data) throw new Error("bad call");
//            }
//            //ON ATTEND LE RETOUR DE L'APPEL AJAX
//            xhr.onload = evt => callback(evt.target.response || evt.srcElement.response);
//
//            xhr.send(data || null);
//        } catch (err) {
//            console.error(err);
//        }
//    };
//
//
//
//    const createProduit = function createProduit(e) {
//        e.preventDefault();
//        const url = "http://localhost:9393/api/v1/produit";
//        doAjax(url, "POST", function getRes(res) {
//            console.log("RES CREATE");
//            console.log(res);
//            console.log(JSON.parse(res));
//        }, {
//            nom: "name",
//            prix: "price",
//            description: "descri"
//        });
//        //        getProduits();
//    };
//
//
//    var getProduits = function getProduits() {
//        const url = "http://localhost:9393/api/v1/produit";
//        doAjax(url, "GET", function getRes(res) {
//            console.log(JSON.parse(res));
//            displayProduits(JSON.parse(res));
//        });
//    };
//
//    var displayProduits = function displayProduits(produitList) {
//        domList.innerHTML = ""; box
//        if (produitList) {
//            produitList.forEach(produit => {
//                let tr = document.createElement("tr");
//                tr.className = "itemproduit";
//                tr.innerHTML += `<td><input type = 'checkbox' class='checkbox'> </td><td>${produit.id}</td><td>${produit.id_marque}</td><td>${produit.nom}</td><td>${produit.prix}</td><td>${produit.description}</td><td><button class = "buttonModif"> Modifier </update></td>`;
//                domList.appendChild(tr);
//            });
//        } else {
//            let tr = document.createElement("tr");
//            tr.innerHTML = `<td colspan = "4">Désolé, le liens avec la base de donnée n'existe pas.</td>`;
//            domList.appendChild(tr);
//        }
//    };
//
//
//    var start = function () {
//        window.document.getElementById("btn_get_produit").onclick = getProduits;
//        window.document.getElementById("btn_new_produit").onclick = createProduit;
//        domList = document.getElementById("list_produit");
//    };
//    window.addEventListener("DOMContentLoaded", start);
//}());



/* jshint esversion : 6 */
const appClient = (function appClient() {
    "use strict";
    var dom = {},
        url = "http://localhost:9393",
        formValues, produitsToDelete = [];

    // READ THE DOC // https://developer.mozilla.org/fr/docs/Web/HTTP/M%C3%A9thode/POST

    const changeFormValues = function changeFormValues(produit) {
        // PREPARATION DU FORMULAIRE EN MODE EDIT
        // on récupère un objet produit pour pré remplir les champs du formulaire d'édition
        dom.hiddenId.value = produit.id;
        dom.nom.value = produit.nom;
        dom.prix.value = produit.prix;
        dom.description.value = produit.description;
    };

    const createProduit = function createProduit(e) { //déclenchée par submit FORM
        doAjax(url + "/api/v1/produit", "POST", res => {
            console.log(JSON.parse(res)); // faire quelque chose ici si erreur : )
            getProduits();
        }, getFormValues()); // récupérer les valeurs actuelles du form
    };

//    const deleteProduit = function deleteProduit() {
        //        doAjax(url + "/api/v1/produit", "DELETE", res => {
        //            // RETOUR DE L APPEL AJAX
        //            getProduits();
        //        }, {
        //            ids: produitsToDelete
        //        });
        //    };

    const displayProduit = function displayProduit(produitList) {
        dom.tab.innerHTML = ""; // on initialise le tableau de produit (tbody HTML vide)
        produitList.forEach(produit => { // pour chaque utilisateur
            let box = document.createElement("input"); // création d'un input
            let tr = document.createElement("tr"); // et d'un tr
            let td = document.createElement("td");
            tr.className = "itemproduit";
            let icon = document.createElement("i"); // et d'une icône ...
            // CHECKBOX
            box.type = "checkbox"; // on configure le type d'input
            box.id = `delete_produit_${produit.id}`; // avec un id qu'on utilisera ...
            box.onchange = prepareProduitDelete;
            // ... quand prepareProduitDelete sera exécutée
            td.appendChild(box);
            tr.innerHTML += `<td></td><td>${produit.id}</td><td>${produit.id_marque}</td><td>${produit.nom}</td><td>${produit.prix}</td><td>${produit.description}</td><td><button class = "buttonModif"> Modifier </update></td>`; // FONTAWESOME ICON
            tr.appendChild(box); // insertion ..            icon.className = "icon far fa-edit"; // paramétrage de l'icône
            icon.id = `edit_produit_${produit.id}`; // attribution d'un attribut id ...
            icon.onclick = prepareProduitEdit; // ... utile quand prepareProduitEdit sera exécutée
            // LI
            tr.appendChild(icon); // du li
            // MONTAGE DU LEGO (TECHNIQUE) !!!
            dom.tab.appendChild(tr); // on ajoute le tf finalisé au tableau HTML d'produit
        });
    };

    const doAjax = function doAjax(url, method, callback, data) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json'); // on paramètre un peu l'entête de notre requête
            data = data ? JSON.stringify(data) : null;

            if (method.toLowerCase() === "post") {
                if (!data) throw new Error("bad call");
            }
            // on attend le retour de l'appel AJAX
            xhr.onload = evt => callback(evt.target.response || evt.srcElement.response);

            xhr.send(data);

        } catch (err) {
            console.error(err);
        }
    };

    const getProduits = function getProduits() {
        doAjax(url + "/api/v1/produit", "GET", function (res) {
            // RETOUR DE L APPEL AJAX
            displayProduit(JSON.parse(res));
        });
    };

    const setFormMode = function setFormMode(mode, id) {
        if (mode === "create") {
            resetFormValues();
            dom.produitInfo.textContent = "Create new produit";
            dom.btnNewProduit.classList.remove("is-hidden");
            dom.btnEditProduit.classList.add("is-hidden");
        } else {
            dom.produitInfo.innerHTML = "Edit produit n° <span id=\"current_edited_id\">" + id + "</span>";
            dom.btnNewProduit.classList.add("is-hidden");
            dom.btnEditProduit.classList.remove("is-hidden");
        }
    };

    const editProduit = function editProduit(id) {
        doAjax("http://localhost:9393/produit/", "PATCH", function (res) {
            // RETOUR DE L APPEL AJAX
            setFormMode("create"); // retour du form en mode create
            getProduits(); // récupère le tableau d'produits mise à jour

        }, getFormValues()); // récupérer les valeurs actuelles du form
    };

    const getFormValues = function getFormValues() {
        /// @todo => améliorer le code ici pour éviter que les valeurs
        // saisies soit incohérentes et/ou manquantes
        // ex: name = 123445637389 OU email === "", etc.
        return {
            id: dom.hiddenId.value,
            nom: dom.nom.value,
            description: dom.description.value
        };
    };

    const prepareProduitEdit = function prepareProduitEdit(e) {
        const id = (function () {
            const icon = e.srcElement || e.target; // quelle icone à été cliquée ?
            return icon.id.split("_")[2]; // sur icon, récupère l'id  de l'produit à éditer
        }());
        setFormMode("update", id);
        doAjax(`http://localhost:9393/api/v1/produit/${id}`, "GET", function (res) {
            changeFormValues(JSON.parse(res));
        });
    };

    const prepareProduitDelete = function prepareProduitDelete(e) {
        const checkbox = e.srcElement || e.target; // quel checkbox à été changé de valeur ?
        const id = Number(checkbox.id.split("_")[2]); // sur checkbox récupère id de l'produit à supprimer
        if (this.checked) { // si le checkbox EST checked
            produitsToDelete.push(id); // pousser l'id courant dans le tableau d'ids d'produit à supprimer
        } else { // si le checkbox n'est PAS checked
            // trouver le numéro de case de l'id qu'on vient de déselectionner
            let index = produitsToDelete.findIndex(v => v === id);
            produitsToDelete.splice(index, 1); // supprimer l'id du tableau d'ids d'produits à supprimer
        }
        console.log("_(0.v.0)_ # produitsToDelete =>");
        console.log(produitsToDelete);
    };

    const resetFormValues = function resetFormValues() {
        return {
            name: dom.name.value = "",
            lastname: dom.lastname.value = "",
            email: dom.email.value = "",
            id: dom.hiddenId.value = ""
        };
    };

    const start = function start() {
        // Tableau des produit
        dom.tab = document.getElementById("tab_produit");

        // FORMULAIRE
        dom.formProduit = document.getElementById("form_produit");
        dom.hiddenId = document.getElementById("produit_id");
        dom.nom = document.getElementById("produit_nom");
        dom.prix = document.getElementById("produit_prix");
        dom.description = document.getElementById("produit_description");

        // BUTTONS
        dom.btnNewProduit = document.getElementById("btn_new_produit");
        //        dom.btnEditProduit = document.getElementById("btn_edit_produit");
        dom.btnGetProduit = document.getElementById("btn_get_produit");
        //        dom.btnDeleteProduit = document.getElementById("btn_del_produit");


        // ATTACHER LES EVENT LISTENERS !!!
        window.document.getElementById("btn_get_produit").onclick = getProduits;
        window.document.getElementById("btn_new_produit").onclick = createProduit;
        dom.btnNewProduit.onclick = createProduit;
        dom.btnEditProduit.onclick = editProduit; // les events sont attachés aux 2 boutons !
        dom.btnDeleteProduit.onclick = deleteProduit; // edition et création d'produits partagent le même formulaire
        //         Enfin empêcher FORM de reload la page (comportement HTML par défaut)
        dom.formProduit.onsubmit = function (e) {
            e.preventDefault();
        };
    };

    // lancement de l'app (front) au chargement du Document
    window.addEventListener("DOMContentLoaded", start);
}());
