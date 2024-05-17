    let User;
    let Foods;
    let Persons;
    let Horse;

    function App() {
        //==============================================================================================================================================================================================================
        // Login Function, First Fetch
        //==============================================================================================================================================================================================================
        async function login(){ 
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const basicAuth = { username: username, password: password };

            let myHorses;

            await axios.get('http://localhost:8080/api/profile', {auth: basicAuth}).then(response => {
                User = response.data;
                ReactDOM.render( <p> Witaj {response.data.name} {response.data.id}! </p>, document.getElementById("loginOutcome"));
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });

            await axios.get('http://localhost:8080/api/MyHorses/', {auth: basicAuth}).then(inResponse => {
                myHorses = inResponse.data.map((item, index) => (<option value={item.id}>{item.name}</option>));
            }).catch(inErr => {
                console.log(inErr)
                ReactDOM.render( <p> Fetching Error Error </p>, document.getElementById("fetchOutcome"));
            });

            const something = (
                <section>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="name"> Choose Horse </label> <br/>
                            <select id="horseSelector" class="form-select"> {myHorses} </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="name"> Action </label> <br/>
                            <button onClick={loadHorse} class="btn btn-success col-md-12"> Edit </button>
                        </div>
                    </div>
                </section>
            )

            ReactDOM.render( <div> {something} </div>, document.getElementById("horseSelect"));
        }
        //==============================================================================================================================================================================================================
        // Update Horse Details
        //==============================================================================================================================================================================================================
        async function updateHorseDetails() {
            const name = document.getElementById('horseNameInput').value;
            const race = document.getElementById('horseRaceInput').value;
            const ointment = document.getElementById('horseOintmentInput').value;
            const fatherName = document.getElementById('horseFatherNameInput').value;
            const motherName = document.getElementById('horseMotherNameInput').value;
            const description = document.getElementById('horseMotherNameInput').value;
            const birthDate = document.getElementById('horseBirthInput').value;

            await axios.put('http://localhost:8080/api/Horse/' + Horse.id, {'name': name, 'race': race, 'ointment': ointment, 'fatherName': fatherName, 'motherName': motherName, 'description': description, 'birthDate': birthDate }).then(response => {
                ReactDOM.render( <p> Sukces </p>, document.getElementById("loginOutcome"));
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Fail </p>, document.getElementById("loginOutcome"));
            });

            login();

        }
        //==============================================================================================================================================================================================================
        // Update Portion Details
        //==============================================================================================================================================================================================================
        async function updatePortionDetails(existingIndex) {

            const inNameID = "inID_" + existingIndex;
            const inNameQuantity = "inQuantity_" + existingIndex;
            const inNameTimeOfDay = "inTimeOfDay_" + existingIndex;

            const inID = document.getElementById(inNameID).value;
            const inQuantity = document.getElementById(inNameQuantity).value;
            const inTimeOfDay = document.getElementById(inNameTimeOfDay).value;

            await axios.post('http://localhost:8080/api/Portion/Update/', {'id': inID, 'quantity': inQuantity, 'timeOfDay': inTimeOfDay}).then(response => {

            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });

            loadHorse();

        }
        //==============================================================================================================================================================================================================
        // Add New Portion
        //==============================================================================================================================================================================================================
        async function addNewPortion(){
            const inFoodID = document.getElementById('newPortionFood').value;
            const inQuantity = document.getElementById('newPortionQuantity').value;
            const inTimeOfDay = document.getElementById('newPortionTimeOfDay').value;

            let newPortionID;

            await axios.post('http://localhost:8080/api/Portion/Add/', {'id': inFoodID, 'quantity': inQuantity, 'timeOfDay': inTimeOfDay}).then(response => {
                newPortionID = response.data.id;
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });

            console.log(newPortionID);
            console.log(Horse.id);

            await axios.post('http://localhost:8080/api/Diet/', {'firstID': Horse.id, 'secondID': newPortionID}).then(response => {
                console.log("Success")
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });

            loadHorse();

        }
        //==============================================================================================================================================================================================================
        // Remove Portion
        //==============================================================================================================================================================================================================
        async function removePortion(){
            let portionId = document.getElementById('portionRemove').value;

            await axios.delete('http://localhost:8080/api/Portion/Remove/' + portionId).then(response => {
                console.log("Success")
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });
            
            loadHorse();
        }
        //==============================================================================================================================================================================================================
        // Fetch Food
        //==============================================================================================================================================================================================================
        async function loadFoods(){
            await axios.get('http://localhost:8080/api/Food/').then(response => {
                response.data.forEach((e) => {
                    Foods = response.data.map((item, index) => (<option value={item.id}>{item.name} {item.price}</option>));
                })
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });
        }
        //==============================================================================================================================================================================================================
        // Fetch Owners
        //==============================================================================================================================================================================================================
        async function loadOwners(){
            await axios.get('http://localhost:8080/api/Person/').then(response => {
                response.data.forEach((e) => {
                    Persons = response.data.map((item, index) => (<option value={item.id}>{item.name} {item.surname[0]}</option>));
                })
                console.log(Persons);
            }).catch(err => {
                console.log(err)
                ReactDOM.render( <p> Login Error </p>, document.getElementById("loginOutcome"));
            });
        }
        //==============================================================================================================================================================================================================
        // Fetch Horse
        //==============================================================================================================================================================================================================
        async function loadHorse() {

            let id = document.getElementById('horseSelector').value;

            loadOwners(); // Refresh Avaliable Owners
            loadFoods(); // Refresh Avaliable Food


            await axios.get('http://localhost:8080/api/All/' + id).then(response => {
                    Horse = response.data;

                    const outOwnerData = response.data.ownerList.map((item, index) => (<option value={item.id}>{item.name} {item.surname[0]}</option>));
                    const outPortionData = response.data.portionsList.map((item, index) => (<option value={item.id}>{item.quantity} {item.food.name} {item.food.price}</option>));

                    const inHorse = (
                        <section style={{padding: 25, margin: 5}} class="bg-success">
                            <div class="row">
                                <div class="form-group col-md-4">
                                    <label for="name"> Name </label>
                                    <input type="text" class="form-control" id="horseNameInput" placeholder="Name" defaultValue={response.data.name}/>
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="surname"> Race </label>
                                    <input type="text" class="form-control" id="horseRaceInput" placeholder="Race" defaultValue={response.data.race}/>
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="name"> Ointment </label> <br/>
                                    <input type="text" class="form-control" id="horseOintmentInput" placeholder="Ointment" defaultValue={response.data.ointment}/>
                                </div>
                            </div>

                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="name"> Father Name </label>
                                    <input type="text" class="form-control" id="horseFatherNameInput" placeholder="Name" defaultValue={response.data.fatherName}/>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="surname"> Mother Name </label>
                                    <input type="text" class="form-control" id="horseMotherNameInput" placeholder="Race" defaultValue={response.data.motherName}/>
                                </div>
                            </div>

                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="surname"> Birth Date </label>
                                    <input type="text" class="form-control" id="horseBirthInput" placeholder="Race" defaultValue={response.data.birthDate}/>
                                </div>

                                <div class="form-group col-md-6">
                                    <label for="name"> Action </label> <br/>
                                    <button onClick={updateHorseDetails} class="btn btn-primary col-md-12"> Update </button>
                                </div>
                            </div>

                        </section>
                    )

                    // Add Portion
                    const inPortion = (
                        <section style={{padding: 25, margin: 5}} class="bg-warning">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <label for="name"> Quantity </label>
                                    <input type="text" class="form-control" id="newPortionQuantity" placeholder="Quantity"/>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="name"> Time of Day </label>
                                    <input type="text" class="form-control" id="newPortionTimeOfDay" placeholder="Morning"/>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="name"> Name </label> <br/>
                                    <select class="form-select" id="newPortionFood"> {Foods} </select>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="name"> Name </label> <br/>
                                    <button onClick={addNewPortion} class="btn btn-success col-md-12"> Add </button>
                                </div>
                            </div>
                        </section>
                    )
                    // Remove Portion
                    const outPortion = (
                        <section style={{padding: 25, margin: 5}} class="bg-warning">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="name"> Name </label> <br/>
                                    <select id="portionRemove" class="form-select"> {outPortionData} </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="name"> Action </label> <br/>
                                    <button onClick={removePortion} class="btn btn-danger col-md-12"> Remove </button>
                                </div>
                            </div>
                        </section>
                    )
                    // Add Owner
                    const inOwner = (
                        <section style={{padding: 25, margin: 5}} class="bg-warning">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="name"> Name </label> <br/>
                                    <select class="form-select"> {Persons} </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="name"> Action </label> <br/>
                                    <button onClick="loadOwnedHorses" class="btn btn-success col-md-12"> Add </button>
                                </div>
                            </div>
                        </section>
                    )
                    // Remove Owner
                    const outOwner = (
                        <section style={{padding: 25, margin: 5}} class="bg-warning">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="name"> Name </label> <br/>
                                    <select class="form-select"> {outOwnerData} </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="name"> Action </label> <br/>
                                    <button onClick="loadOwnedHorses" class="btn btn-danger col-md-12"> Remove </button>
                                </div>
                            </div>
                        </section>
                    )
                    // List Owners
                    const owners = response.data.ownerList.map((o, index) => (
                        <section style={{padding: 25, margin: 5}} class="bg-success">

                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label for="name"> Name </label>
                                        <input readonly="true" type="text" class="form-control" id="" placeholder="Name" value={o.name}/>
                                    </div>

                                    <div class="form-group col-md-6">
                                        <label for="surname"> Surname </label>
                                        <input readonly="true" type="text" class="form-control" id="" placeholder="Surname" value={o.surname}/>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <input readonly="true" type="text" class="form-control" id="" placeholder="+48 555 555 555" value={o.phoneNumber}/>
                                </div>

                                <div class="form-group">
                                    <label for="email">E-Mail Address</label>
                                    <input readonly="true" type="text" class="form-control" id="" placeholder="example@mail.com" value={o.emailAddress}/>
                                </div>

                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label for="name"> Country </label>
                                        <input readonly="true" type="text" class="form-control" id="" placeholder="Country" value={o.address.city}/>
                                    </div>

                                    <div class="form-group col-md-3">
                                        <label for="surname"> Voivodeship </label>
                                        <input readonly="true" type="text" class="form-control" id="" placeholder="Voivodeship" value={o.address.voivodeship}/>
                                    </div>

                                    <div class="form-group col-md-3">
                                        <label for="phone">Post Code</label>
                                        <input readonly="true" type="text" class="form-control" id="" placeholder="Post-Code" value={o.address.postCode}/>
                                    </div>

                                    <div class="form-group col-md-3">
                                        <label for="email">City</label>
                                        <input readonly="true" type="text" class="form-control" id="" placeholder="City" value={o.address.city}/>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label for="phone">Street</label>
                                        <input type="text" class="form-control" id="" placeholder="Street" value={o.address.street}/>
                                    </div>

                                    <div class="form-group col-md-6">
                                        <label for="email">House Number</label>
                                        <input type="text" class="form-control" id="" placeholder="House Number" value={o.address.houseNumber}/>
                                    </div>
                                </div>

                        </section>
                    ));
                    // List Portions
                    const portions = response.data.portionsList.map((p, index) => (
                        <section style={{padding: 25, margin: 5}} class="bg-success">
                            <div class="row">
                                <div class="form-group col-md-1">
                                    <label for="name" class> ID </label>
                                    <input readonly="true" type="text" class="form-control" id={"inID_" + p.id} placeholder="Index" value={p.id}/>
                                </div>

                                <div class="form-group col-md-2">
                                    <label for="name" class> Quantity </label>
                                    <input type="text" class="form-control" id={"inQuantity_" + p.id} placeholder="Quantity" defaultValue={p.quantity}/>
                                </div>

                                <div class="form-group col-md-3">
                                    <label for="name"> Time of Day </label>
                                    <input type="text" class="form-control" id={"inTimeOfDay_" + p.id} placeholder="Morning" defaultValue={p.timeOfDay}/>
                                </div>

                                <div class="form-group col-md-2">
                                    <label for="name"> Name </label>
                                    <input readonly="true" type="text" class="form-control" id={"inFoodName_" + p.id} placeholder="Name" value={p.food.name}/>
                                </div>

                                <div class="form-group col-md-2">
                                    <label for="name"> Price </label>
                                    <input readonly="true" type="text" class="form-control" id={"inFoodPrice_" + p.id} placeholder="Price" value={p.food.price}/>
                                </div>

                                <div class="form-group col-md-2">
                                    <label for="name"> Action </label> <br/>
                                    <button onClick={() => updatePortionDetails(p.id)} class="btn btn-primary col-md-12"> Update </button>
                                </div>

                            </div>
                        </section>
                    ));

                    ReactDOM.render(<div> {inHorse} {owners} {inOwner} {outOwner} {portions} {inPortion} {outPortion}</div>, document.getElementById('placeHolder3'))


            }).catch(err => {
                console.log(err)
            });

        }
        //==============================================================================================================================================================================================================
        // Login Form
        //==============================================================================================================================================================================================================
        return (
            <div class="container">
                <form>
                    <div class="form-group row">

                        <div class="form-group col-md-4">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" placeholder="Username"/>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="Name">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Password"/>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="Name">Accept</label>
                            <button type="button" class="btn btn-success col-md-12" onClick={login}> Login </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    const container = document.getElementById('top');
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);