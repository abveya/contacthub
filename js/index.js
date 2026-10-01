var contactForm = document.getElementById("contactForm");
var imageInput = document.getElementById("imageInput");
var nameInput = document.getElementById("fullName");
var phoneInput = document.getElementById("phoneInput");
var emailInput = document.getElementById("emailInput");
var addressInput = document.getElementById("addressInput");
var groupSelect = document.getElementById("group");
var noteInput = document.getElementById("noteInput");
var favoriteCheckInput = document.getElementById("favChecked");
var emergencyCheckInput = document.getElementById("emergencyChecked");
var searchInput = document.getElementById("searchInput");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");

var allContacts = [];
var mainIndex;
if (localStorage.getItem("contacts")) {
    allContacts = JSON.parse(localStorage.getItem("contacts"));
    displayContact();
    displayEmergency();
    displayFav();
    favContact();
    emergencyContact();
    totalContact();
} else {
    emptyContact();
    displayEmergency();
    displayFav();
}

function clear() {
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    addressInput.value = "";
    document.getElementById("image-profile-icon").innerHTML = `<i class="fa-solid fa-user"></i>`;
    noteInput.value = "";
    imageInput.value = "";
    groupSelect.value = "";
    favoriteCheckInput.checked = false;
    emergencyCheckInput.checked = false;
}

function displayImage() {
    if (imageInput.files.length > 0) {
        document.getElementById("image-profile-icon").innerHTML = `
        <img src="images/${imageInput.files[0].name}" class="w-100 object-fit-cover h-100" />
        `
    }
}

function validation(input, msg) {
    var msgId = document.getElementById(msg);
    var regex = {
        fullName: /^[A-Za-z\s]{2,50}$/,
        phoneInput: /^01(2|5|0|1)[0-9]{8}$/,
        emailInput: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        imageInput: /^[^\s]+\.(jpg|jpeg|png|gif|bmp)$/i
    };
    if (input.id == "imageInput") {
        if (imageInput.files.length == 0) {
            msgId.classList.add("d-none");
            return true;
        }
        if (!regex.imageInput.test(imageInput.files[0]?.name)) {
            msgId.classList.remove("d-none");
            return false;
        }
        msgId.classList.add("d-none");
        input.classList.remove("invalid-input");
        return true;
    }

    if (input.id == "emailInput") {
        if (input.value.trim() === "") {
            msgId.classList.add("d-none");
            input.classList.remove("invalid-input");
            return true;
        }
    }

    if (input.value.trim() == "" || regex[input.id].test(input.value.trim()) == false) {
        msgId.classList.remove("d-none");
        input.classList.add("invalid-input");
        return false;
    } else {
        msgId.classList.add("d-none")
        input.classList.remove("invalid-input")
        return true;
    }
}

function addContact() {
    var contact = {
        name: nameInput.value,
        phone: phoneInput.value,
        image: imageInput.files[0]?.name,
        email: emailInput.value,
        address: addressInput.value,
        group: groupSelect.value,
        note: noteInput.value,
        favorite: favoriteCheckInput.checked ? true : false,
        emergency: emergencyCheckInput.checked ? true : false,
    };
    if (!validation(nameInput, "msgName")) {
        Swal.fire({
            title: "Missing Name",
            text: "Please enter a name for the contact!",
            icon: "error"
        });
        return;
    } else if (!validation(emailInput, "msgEmail")) {
        Swal.fire({
            title: "Missing Email",
            text: "Please enter a email for the contact!",
            icon: "error"
        });
        return;
    } else if (!validation(phoneInput, "msgPhone")) {
        Swal.fire({
            title: "Missing Phone",
            text: "Please enter a phone for the contact!",
            icon: "error"
        });
        return;
    } else if (!validation(imageInput, "msgImage")) {
        Swal.fire({
            title: "Missing image",
            text: "Please enter a valid image for the contact!",
            icon: "error"
        });
        return;
    }
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].phone === contact.phone) {
            Swal.fire({
                title: "duplicate Phone",
                text: "Please enter a phone for the contact!",
                icon: "error"
            });
            return;
        }
    }
    allContacts.push(contact);
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    clear();
    closeFormFun();
    displayContact();
    Swal.fire({
        icon: "success",
        title: "Added",
        text: "Contact has been added successfully",
        showConfirmButton: false,
        timer: 1500
    });
    displayEmergency();
    displayFav();
    favContact();
    emergencyContact();
    totalContact();
}
contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (updateBtn.classList.contains("d-none")) {
        addContact();
    } else if (addBtn.classList.contains("d-none")) {
        update();
    }
})

function displayName(index) {
    var spitName = allContacts[index].name.trim().split(" ", 2)
    var mainName = "";
    for (var i = 0; i < spitName.length; i++) {
        mainName += spitName[i].charAt(0)
    }
    return mainName;
}

function changeBg(index) {
    var bgColors = {
        bg1: "first-bg-profile",
        bg2: "second-bg-profile",
        bg3: "third-bg-profile"
    }
    var objectLength = Object.keys(bgColors).length
    var lengthName = allContacts[index].name.length
    var x = lengthName % objectLength;
    if (x == 0) {
        return bgColors.bg1
    } else if (x == 1) {
        return bgColors.bg2
    } else {
        return bgColors.bg3
    }
}

function displayContact() {
    if (allContacts.length == 0) {
        emptyContact();
        return;
    }
    var text = searchInput.value.toLowerCase();
    var container = "";
    for (var i = 0; i < allContacts.length; i++) {
        var profileBg = changeBg(i);
        var mainName = displayName(i);
        var groupClass = "";
        if (allContacts[i].group === "Family") {
            groupClass = "color-blue-700 bg-blue-100";
        } else if (allContacts[i].group === "Friends") {
            groupClass = "bg-green-100 color-green-700";
        } else if (allContacts[i].group === "School") {
            groupClass = "color-amber-700 bg-amber-100";
        } else if (allContacts[i].group === "Work") {
            groupClass = "color-purple-700 bg-purple-100";
        } else if (allContacts[i].group === "Other") {
            groupClass = "color-gray-700 bg-gray-100";
        }
        if (allContacts[i].name.toLowerCase().includes(text)) {
            container += `
                <div class="col-md-6 col-12">
                    <div class="card w-100 h-100 border border-gray-100 bg-white d-flex flex-column rounded-4 overflow-hidden">
                        <div class="details px-3 flex-grow-1">
                            <div class="details-top d-flex align-items-start">
                                <div class="profile-icons position-relative">
                                    <div class="profile ${profileBg} flex-center rounded-12 overflow-hidden">
                                        ${allContacts[i].image ? `<img src="images/${allContacts[i].image}" class="w-100 h-100 object-fit-cover" />` : `<span class="text-size-lg text-white fw-semibold">${mainName}</span>`}
                                    </div>
                                    ${allContacts[i].favorite
                    ? `<span class="position-absolute bg-amber-400 rounded-circle flex-center fav text-white badge-profile-icon">
                                        <i class="fa-solid fa-star"></i>
                                    </span>`
                    : ""
                }
                                    ${allContacts[i].emergency
                    ? `<span class="position-absolute bg-rose-500 rounded-circle flex-center emergency text-white badge-profile-icon">
                                        <i class="fa-solid fa-heart-pulse"></i>
                                    </span>`
                    : ""
                }
                                </div>
                                <div class="pt-1 right-details text-truncate">
                                    <h3 class="text-truncate fw-semibold color-gray-900 fs-6 m-0">
                                        ${allContacts[i].name}
                                    </h3>
                                    <div class="d-flex align-items-center pt-1 gap-2">
                                        <div class="icon flex-center rounded-3 bg-blue-100 color-blue-600">
                                            <i class="fa-solid fa-phone"></i>
                                        </div>
                                        <span class="color-gray-500 text-size-md text-truncate">${allContacts[i].phone}</span>
                                    </div>
                                </div>
                            </div>
                            ${allContacts[i].email
                    ? `<div class="email d-flex align-items-center gap-2">
                                <div class="icon flex-shrink-0 flex-center rounded-3 bg-violet-100 color-violet-600">
                                    <i class="fa-solid fa-envelope"></i>
                                </div>
                                <span class="color-gray-500 text-size-md text-truncate">
                                    ${allContacts[i].email}
                                    </span>
                            </div>`
                    : ""
                }
                            ${allContacts[i].address
                    ? `<div class="address mt-2 d-flex align-items-center gap-2">
                                <div class="icon flex-shrink-0 flex-center rounded-3 bg-emerald-100 color-emerald-600">
                                    <i class="fa-solid fa-location-dot"></i>
                                </div>
                                <span class="color-gray-500 text-size-md text-truncate">
                                    ${allContacts[i].address}
                                </span>
                            </div>`
                    : ""
                }
                            <div class="badges">
                            ${allContacts[i].emergency
                    ? `<span class="d-inline-block flex-center bg-rose-50 color-rose-600 fw-medium rounded-3 py-1 px-2">
                                    <i class="fa-solid fa-heart-pulse"></i>
                                    Emergency
                            </span>`
                    : ""
                }
                            ${allContacts[i].group
                    ? `<span class="d-inline-block flex-center ${groupClass} fw-medium rounded-3 py-1 px-2">
                                ${allContacts[i].group}
                            </span>`
                    : ""
                }
                        </div>
                        </div>
                        <div class="all-icons px-3 d-flex align-items-center justify-content-between border-top border-gray-100">
                            <div class="left-icons flex-center">
                                <div class="flex-center">
                                    <a href="tel:${allContacts[i].phone}" title="Call" class="color-emerald-600 text-size-md rounded-3 bg-emerald-50 flex-center">
                                        <i class="fa-solid fa-phone"></i>
                                    </a>
                                </div>
                                <div class="flex-center">
                                ${allContacts[i].email
                    ? ` <a href="mailto:${allContacts[i].email}" title="Email" class="color-violet-600 text-size-md rounded-3 bg-violet-50 flex-center">
                                        <i class="fa-solid fa-envelope"></i>
                                    </a>`
                    : ""
                }
                                </div>
                            </div>
                            <div class="right-icons d-flex align-items-center">
                                ${allContacts[i].favorite
                    ? `<div onClick="removeFav(${i})" class="icon fill-icon color-amber-400 text-size-md rounded-3 bg-amber-50 flex-center" title="Favorite">
                                    <i class="fa-solid fa-star"></i>
                                </div>`
                    : ` <div onClick="addFav(${i})" class="icon color-gray-400 text-size-md rounded-3 bg-gray-50 flex-center" title="Favorite">
                                    <i class="fa-regular fa-star"></i>
                                </div>`
                }
                                ${allContacts[i].emergency
                    ? ` <div onClick="removeEmergency(${i})" class="icon fill-icon color-rose-500 text-size-md rounded-3 bg-rose-50 flex-center" title="Emergency">
                                    <i class="fa-solid fa-heart-pulse"></i>
                                </div>`
                    : `<div onClick="addEmergency(${i})" class="icon color-gray-400 text-size-md rounded-3 bg-gray-50 flex-center" title="Emergency">
                                    <i class="fa-regular fa-heart"></i>
                                </div>`
                }
                                <div class="icon color-gray-500 text-size-md rounded-3 bg-gray-50 flex-center" onClick="editContact(${i})" title="Edit">
                                    <i class="fa-solid fa-pen"></i>
                                </div>
                                <div class="icon color-gray-500 text-size-md rounded-3 bg-gray-50 flex-center" onClick="deleteContact(${i})" title="Delete">
                                    <i class="fa-solid fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    document.getElementById("rowData").innerHTML = container;
    if (container == "") {
        emptyContact();
    }
}

function addFav(index) {
    allContacts[index].favorite = true;
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    displayFav();
    favContact();
    displayContact();
}

function removeFav(index) {
    allContacts[index].favorite = false;
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    displayFav();
    displayContact();
    favContact();
}

function displayFav() {
    var container = "";
    for (var i = 0; i < allContacts.length; i++) {
        var profileBg = changeBg(i);
        var mainName = displayName(i);
        if (allContacts[i].favorite) {
            container += ` <div class="col-xl-12 col-md-6">
                        <div class="contact d-flex align-items-center bg-gray-50 rounded-12">
                            <div class="profile ${profileBg} flex-center rounded-12 overflow-hidden flex-shrink-0 ">
                            ${allContacts[i].image ? `<img src="images/${allContacts[i].image}" class="w-100 h-100 object-fit-cover" />` : `<span class="text-size-md text-white fw-semibold">${mainName}</span>`}
                            </div>
                        <div class="flex-grow-1 text-truncate">
                            <h3 class="text-truncate color-gray-900 text-size-md fw-medium m-0">
                            ${allContacts[i].name}
                            </h3>
                            <p class="color-gray-500 text-size-sm text-truncate m-0">
                            ${allContacts[i].phone}
                            </p>
                        </div>
                        <div class="flex-center">
                            <a href="tel:${allContacts[i].phone}" title="Call"
                            class="color-emerald-600 text-size-md rounded-3 bg-emerald-50 flex-center">
                            <i class="fa-solid fa-phone"></i></a>
                        </div>
                        </div>
                    </div>`;
        }
    }
    if (container == "") {
        container = `<div class="col-12">
                        <div class="empty-contact flex-center">
                            <p class="color-gray-400 text-size-md m-0"> No favorites yet</p>
                        </div>
                    </div>`
    }
    document.getElementById("favContacts").innerHTML = container;
}

function favContact() {
    var fav = 0;
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].favorite) {
            fav += 1;
        }
    }
    document.getElementById("favContactsCount").innerHTML = fav;
}

function addEmergency(index) {
    allContacts[index].emergency = true;
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    displayEmergency();
    displayContact();
    emergencyContact();
}

function removeEmergency(index) {
    allContacts[index].emergency = false;
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    displayEmergency();
    displayContact();
    emergencyContact();
}

function displayEmergency() {
    var container = "";
    for (var i = 0; i < allContacts.length; i++) {
        var profileBg = changeBg(i);
        var mainName = displayName(i);
        if (allContacts[i].emergency) {
            container += `  
            <div class="col-xl-12 col-md-6">
                        <div class="contact d-flex align-items-center bg-gray-50 rounded-12">
                            <div class="profile ${profileBg} flex-center rounded-12 overflow-hidden flex-shrink-0 ">
                                ${allContacts[i].image ? `<img src="images/${allContacts[i].image}" class="w-100 h-100 object-fit-cover" />` : `<span class="text-size-md text-white fw-semibold">${mainName}</span>`}
                            </div>
                            <div class="flex-grow-1 text-truncate">
                                <h3 class="text-truncate color-gray-900 text-size-md fw-medium m-0">
                                ${allContacts[i].name}
                                </h3>
                                <p class="color-gray-500 text-size-sm text-truncate m-0">
                                ${allContacts[i].phone}
                                </p>
                            </div>
                        <div class="flex-center">
                            <a href="tel:${allContacts[i].phone}" title="Call"
                                class="color-rose-600 text-size-md rounded-3 bg-rose-100 flex-center">
                                <i class="fa-solid fa-phone"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
        }
    }
    if (container == "") {
        container = `<div class="col-12">
                        <div class="empty-contact flex-center">
                            <p class="color-gray-400 text-size-md m-0">No emergency contacts</p>
                        </div>
                    </div>`
    }
    document.getElementById("emergencyContacts").innerHTML = container;
}

function emergencyContact() {
    var emergency = 0;
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].emergency) {
            emergency += 1;
        }
    }
    document.getElementById("emergencyContactsCount").innerHTML = emergency;
}

function editContact(index) {
    mainIndex = index;
    var mainName = displayName(index);
    contactForm.classList.remove("d-none");
    nameInput.value = allContacts[mainIndex].name;
    phoneInput.value = allContacts[mainIndex].phone;
    if (allContacts[mainIndex].image) {
        document.getElementById("image-profile-icon").innerHTML = `
            <img 
                src="images/${allContacts[mainIndex].image}" 
                class="w-100 h-100 object-fit-cover"
            >
        `;
    } else {
        document.getElementById("image-profile-icon").innerHTML = `
            ${mainName}
        `;
    }
    noteInput.value = allContacts[mainIndex].note;
    emailInput.value = allContacts[mainIndex].email;
    addressInput.value = allContacts[mainIndex].address;
    groupSelect.value = allContacts[mainIndex].group;
    favoriteCheckInput.checked = allContacts[mainIndex].favorite;
    emergencyCheckInput.checked = allContacts[mainIndex].emergency;
    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

function update() {
    var contact = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        image: imageInput.files[0]?.name || allContacts[mainIndex].image,
        address: addressInput.value,
        group: groupSelect.value,
        note: noteInput.value,
        favorite: favoriteCheckInput.checked ? true : false,
        emergency: emergencyCheckInput.checked ? true : false,
    };
    for (var i = 0; i < allContacts.length; i++) {
        if (i !== mainIndex && allContacts[i].phone == contact.phone) {
            Swal.fire({
                title: "duplicate Phone",
                text: "Please enter a phone for the contact!",
                icon: "error"
            });
            return;
        }
    }
    if (!validation(nameInput, "msgName")) {
        Swal.fire({
            title: "Missing Name",
            text: "Please enter a name for the contact!",
            icon: "error"
        });
        return;
    } else if (!validation(emailInput, "msgEmail")) {
        Swal.fire({
            title: "Missing Email",
            text: "Please enter a email for the contact!",
            icon: "error"
        });
        return;
    } else if (!validation(phoneInput, "msgPhone")) {
        Swal.fire({
            title: "Missing Phone",
            text: "Please enter a phone for the contact!",
            icon: "error"
        });
        return;
    }
    allContacts.splice(mainIndex, 1, contact);
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    clear();
    closeFormFun();
    displayContact();
    Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Contact has been updated successfully",
        showConfirmButton: false,
        timer: 1500
    });
    displayFav();
    displayEmergency();
    totalContact();
    favContact();
    emergencyContact();
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
}

function deleteContact(index) {
    Swal.fire({
        title: "Delete Contact?",
        text: `Are you sure you want to delete ${allContacts[index].name}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            allContacts.splice(index, 1);
            localStorage.setItem("contacts", JSON.stringify(allContacts));
            displayContact();
            favContact();
            emergencyContact();
            displayEmergency();
            displayFav();
            totalContact();
            Swal.fire({
                title: "Deleted!",
                text: "Contact has been deleted",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

function showFormFun() {
    contactForm.classList.remove("d-none");
}

function closeFormFun() {
    contactForm.classList.add("d-none");
    clear();
}

function emptyContact() {
    document.getElementById("rowData").innerHTML = `<div class="col-12">
                    <div class=" flex-center flex-column empty-contact">
                        <div class="icon color-gray-300 bg-gray-100 rounded-4 flex-center mb-3">
                            <i class="fa-solid fa-address-book"></i>
                        </div>
                        <h3 class="fs-6 color-gray-500 fw-medium m-0">No contacts found</h3>
                        <p class="mt-1 m-0 text-size-md color-gray-400">Click "Add Contact" to get started</p>
                    </div>
                </div>`
}

function totalContact() {
    var total = 0;
    for (var i = 0; i < allContacts.length; i++) {
        total += 1;
    }
    document.getElementById("totalContactsCount").innerHTML = total;
    document.getElementById("top-heading").innerHTML = `
                <h2 class="fw-bold color-gray-900 m-0">All Contacts</h2>
                <p class="pt-1 m-0 color-gray-500 text-size-md">
                Manage and organize your ${total} contacts
                </p>`
}

