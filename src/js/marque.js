///* global window*/
//
//var appMarque = (function appMarque() {
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
//const createMarque = function createMarque(e) {
//    e.preventDefault();
//    const url = "http://localhost:9393/api/v1/marque";
//    doAjax(url, "POST", function getRes(res) {
//        console.log("RES CREATE");
//        console.log(res);
//        console.log(JSON.parse(res));
//    }, {
//        id: "id",
//        nom: "nom",
//    });
//    //        getMarques();
//};
//
//
//var getMarques = function getMarques() {
//    const url = "http://localhost:9393/api/v1/marque";
//    doAjax(url, "GET", function getRes(res) {
//        console.log(JSON.parse(res));
//        displayMarques(JSON.parse(res));
//    });
//};
//
//var displayMarques = function displayMarques(marqueList) {
//    domList.innerHTML = "";
//    if (marqueList) {
//        marqueList.forEach(marque => {
//            let tr = document.createElement("tr");
//            tr.className = "itemmarque";
//            tr.innerHTML += `<td><input type = 'checkbox' class='checkbox'> </td><td>${marque.id}</td><td>${marque.nom}</td><td><button> update</update></td>`;
//            domList.appendChild(tr);
//        });
//    } else {
//        let tr = document.createElement("tr");
//        tr.innerHTML = `<td colspan = "4">Désolé, le liens avec la base de donnée n'existe pas.</td>`;
//        domList.appendChild(tr);
//    }
//};
//
//
//    var start = function () {
//        window.document.getElementById("btn_get_marque").onclick = getMarques;
//        window.document.getElementById("btn_new_marque").onclick = createMarque;;
//        domList = document.getElementById("list_marque");
//    }
//    window.addEventListener("DOMContentLoaded", start);
//}());

/* jshint esversion : 6 */
const appClient = (function appClient() {
    "use strict";
    var dom = {},
        url = "http://localhost:9393",
        formValues, marquesToDelete = [];

    // READ THE DOC // https://developer.mozilla.org/fr/docs/Web/HTTP/M%C3%A9thode/POST

    const changeFormValues = function changeFormValues(marque) {
        // PREPARATION DU FORMULAIRE EN MODE EDIT
        // on récupère un objet marque pour pré remplir les champs du formulaire d'édition
        dom.hiddenId.value = marque.id;
        dom.nom.value = marque.nom;
        dom.prix.value = marque.prix;
        dom.description.value = marque.description;
    };

    const createMarque = function createMarque(e) { //déclenchée par submit FORM
        doAjax(url + "/api/v1/marque", "POST", res => {
            console.log(JSON.parse(res)); // faire quelque chose ici si erreur : )
            getMarques();
        }, getFormValues()); // récupérer les valeurs actuelles du form
    };

    //    const deleteMarque = function deleteMarque() {
    //        doAjax(url + "/api/v1/marque", "DELETE", res => {
    //            // RETOUR DE L APPEL AJAX
    //            getMarques();
    //        }, {
    //            ids: marquesToDelete
    //        });
    //    };

    const displayMarque = function displayMarque(marqueList) {
        dom.tab.innerHTML = ""; // on initialise le tableau de marque (tbody HTML vide)
        marqueList.forEach(marque => { // pour chaque utilisateur
            let box = document.createElement("input"); // création d'un input
            let tr = document.createElement("tr"); // et d'un tr
            let td = document.createElement("td");
            tr.className = "itemmarque";
            let icon = document.createElement("i"); // et d'une icône ...
            // CHECKBOX
            box.type = "checkbox"; // on configure le type d'input
            box.id = `delete_marque_${marque.id}`; // avec un id qu'on utilisera ...
            box.onchange = prepareMarqueDelete;
            // ... quand prepareMarqueDelete sera exécutée
            td.appendChild(box);
            tr.innerHTML += `<td></td><td>${marque.id}</td><td>${marque.nom}</td><td><button class = "buttonModif"> Modifier </update></td>`; // FONTAWESOME ICON
            tr.appendChild(box); // insertion ..            icon.className = "icon far fa-edit"; // paramétrage de l'icône
            icon.id = `edit_marque_${marque.id}`; // attribution d'un attribut id ...
            icon.onclick = prepareMarqueEdit; // ... utile quand prepareMarqueEdit sera exécutée
            // LI
            tr.appendChild(icon); // du li
            // MONTAGE DU LEGO (TECHNIQUE) !!!
            dom.tab.appendChild(tr); // on ajoute le tf finalisé au tableau HTML d'marque
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

    const getMarques = function getMarques() {
        doAjax(url + "/api/v1/marque", "GET", function (res) {
            // RETOUR DE L APPEL AJAX
            displayMarque(JSON.parse(res));
        });
    };

    const setFormMode = function setFormMode(mode, id) {
        if (mode === "create") {
            resetFormValues();
            dom.marqueInfo.textContent = "Create new marque";
            dom.btnNewMarque.classList.remove("is-hidden");
            dom.btnEditMarque.classList.add("is-hidden");
        } else {
            dom.marqueInfo.innerHTML = "Edit marque n° <span id=\"current_edited_id\">" + id + "</span>";
            dom.btnNewMarque.classList.add("is-hidden");
            dom.btnEditMarque.classList.remove("is-hidden");
        }
    };

    const editMarque = function editMarque(id) {
        doAjax("http://localhost:9393/marque/", "PATCH", function (res) {
            // RETOUR DE L APPEL AJAX
            setFormMode("create"); // retour du form en mode create
            getMarques(); // récupère le tableau d'marques mise à jour

        }, getFormValues()); // récupérer les valeurs actuelles du form
    };

    const getFormValues = function getFormValues() {
        /// @todo => améliorer le code ici pour éviter que les valeurs
        // saisies soit incohérentes et/ou manquantes
        // ex: nom = 123445637389 OU email === "", etc.
        return {
            id: dom.hiddenId.value,
            nom: dom.nom.value,
        };
    };

    const prepareMarqueEdit = function prepareMarqueEdit(e) {
        const id = (function () {
            const icon = e.srcElement || e.target; // quelle icone à été cliquée ?
            return icon.id.split("_")[2]; // sur icon, récupère l'id  de l'marque à éditer
        }());
        setFormMode("update", id);
        doAjax(`http://localhost:9393/api/v1/marque/${id}`, "GET", function (res) {
            changeFormValues(JSON.parse(res));
        });
    };

    const prepareMarqueDelete = function prepareMarqueDelete(e) {
        const checkbox = e.srcElement || e.target; // quel checkbox à été changé de valeur ?
        const id = Number(checkbox.id.split("_")[2]); // sur checkbox récupère id de l'marque à supprimer
        if (this.checked) { // si le checkbox EST checked
            marquesToDelete.push(id); // pousser l'id courant dans le tableau d'ids d'marque à supprimer
        } else { // si le checkbox n'est PAS checked
            // trouver le numéro de case de l'id qu'on vient de déselectionner
            let index = marquesToDelete.findIndex(v => v === id);
            marquesToDelete.splice(index, 1); // supprimer l'id du tableau d'ids d'marques à supprimer
        }
        console.log("_(0.v.0)_ # marquesToDelete =>");
        console.log(marquesToDelete);
    };

    const resetFormValues = function resetFormValues() {
        return {
            nom: dom.nom.value = "",
            lastnom: dom.lastnom.value = "",
            email: dom.email.value = "",
            id: dom.hiddenId.value = ""
        };
    };

    const start = function start() {
        // Tableau des marques
        dom.tab = document.getElementById("tab_marque");

        // FORMULAIRE
        dom.formMarque = document.getElementById("form_marque");
        dom.hiddenId = document.getElementById("marque_id");
        dom.nom = document.getElementById("marque_nom");

        // BUTTONS
        dom.btnNewMarque = document.getElementById("btn_new_marque");
        //        dom.btnEditMarque = document.getElementById("btn_edit_marque");
        dom.btnGetMarque = document.getElementById("btn_get_marque");
        //        dom.btnDeleteMarque = document.getElementById("btn_del_marque");


        // ATTACHER LES EVENT LISTENERS !!!
        window.document.getElementById("btn_get_marque").onclick = getMarques;
        window.document.getElementById("btn_new_marque").onclick = createMarque;
        dom.btnNewMarque.onclick = createMarque;
        dom.btnEditMarque.onclick = editMarque; // les events sont attachés aux 2 boutons !
        dom.btnDeleteMarque.onclick = deleteMarque; // edition et création d'marques partagent le même formulaire
        //         Enfin empêcher FORM de reload la page (comportement HTML par défaut)
        dom.formMarque.onsubmit = function (e) {
            e.preventDefault();
        };
    };

    // lancement de l'app (front) au chargement du Document
    window.addEventListener("DOMContentLoaded", start);
}());
