import React, { Component } from 'react';
import { Button, Form, Row, Table, Col } from 'react-bootstrap';
import SprintAxios from '../../apis/SprintAxios';

class Zadaci extends Component {

    constructor(props){
        super(props)

        let search = {
            imeSearch: "",
            sprintSearch: -1
        }

        let task = {
            ime: '',
            zaduzeni: '',
            bodovi: '',
            stanjeId: '',
            sprintId: '',
        }

        this.state = {
            zadaci: [],
            sprintovi: [],
            stanja: [],
            pageNo: 0,
            totalPages: 1,
            showForm: false,
            search: search,
            sprintSum: "",
            task: task
        }
    }

    componentDidMount(){
        this.getZadaci(0);
        this.getSprintovi();
        this.getStanja();
    }

    getSprintovi(){
        SprintAxios.get("/sprintovi")
            .then(res => {
                console.log(res.data)
                this.setState({sprintovi: res.data})
            })
            .catch(error => {
                console.log(error)
            })
    }

    getStanja(){
        SprintAxios.get("/stanja")
            .then(res => {
                this.setState({stanja: res.data})
            })
            .catch(error => {
                console.log(error)
            })
    }

    async getZadaci(newPageNo){

        let config = {
            params: {
                pageNo: newPageNo
            }
        }

        if(this.state.search.imeSearch != ""){
            config.params['ime'] = this.state.search.imeSearch
        }
        if(this.state.search.sprintSearch != -1){
            config.params['sprintId'] = this.state.sprintSearch
        }
        console.log(config.params)
        try {      
            const res = await SprintAxios.get("/zadaci", config);
            console.log(res.data)
            console.log(res.headers)
            let ss = res.headers['sprint-sum']
            if(ss == undefined){
                ss = ""
            }
            this.setState({
                zadaci: res.data,
                pageNo: newPageNo,
                totalPages: res.headers['total-pages'],
                sprintSum: ss 
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getSprint(id){

        try {      
            const res = await SprintAxios.get("/sprint/" + id);
            console.log(res.data)
            this.setState({
                zadaci: res.data
            })
        } catch (error) {
            console.log(error)
        }
    }

    renderZadaci(){
        return this.state.zadaci.map(zadatak => {
            return(
                <tr key = {zadatak.id}>
                    <td>{zadatak.ime}</td>
                    <td>{zadatak.zaduzeni}</td>
                    <td>{zadatak.bodovi}</td>
                    <td>{zadatak.stanjeIme}</td>
                    <td>{zadatak.sprintIme}</td>
                    <td><Button variant="primary" disabled={zadatak.stanjeIme==="Zavrsen"} onClick={() => this.sledeceStanje(zadatak.id)}>Predji na sledece stanje</Button></td>
                    <td><Button variant="warning" onClick={() => this.izmeniZadatak(zadatak.id)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteZadatak(zadatak.id)}>Delete</Button></td>
                </tr>
            )
        })
    }

   sledeceStanje(id){
       SprintAxios.put("/zadaci/" + id + "/action")
       .then(res => {
           console.log(res)
           window.location.reload()
       })
       .catch(error => {
           console.log(error)
       })
   }

    izmeniZadatak(id){
        this.props.history.push("/zadaci/izmeni/" + id);
    }

    deleteZadatak(id){
        SprintAxios.delete("/zadaci/" + id)
            .then(res => {
                window.location.reload()
            })
            .catch(error => {
                console.log(error)
            })
    }

    changeFormView(){
        this.setState({showForm: !this.state.showForm})
    }

    onSearchCange(e){
        let name = e.target.name;
        let value = e.target.value;

        let search = this.state.search;
        search[name] = value
        this.setState(search)
    }

    onInputChange(e){
        let name= e.target.name;
        let value = e.target.value;

        let task = this.state.task
        task[name] = value
        this.setState(task)
    }

    dodajZadatak(){

        let params = {
            ime: this.state.task.ime,
            zaduzeni: this.state.task.zaduzeni,
            bodovi: this.state.task.bodovi,
            sprintId: this.state.task.sprintId,
            stanjeId: this.state.task.stanjeId
        }

        SprintAxios.post("/zadaci", params)
            .then(res => {
                console.log(res.data)
                window.location.reload()
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                <Row style={{marginBottom: '35px'}}>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>Ime</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="ime"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Zaduzeni</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="zaduzeni"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Bodovi</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="bodovi"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Stanje</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="stanjeId"
                                    onChange={(e) => this.onInputChange(e)}>
                                        <option></option>
                                        {this.state.stanja.map(stanje => {
                                            return(
                                                <option key={stanje.id} value={stanje.id}>{stanje.ime}</option>
                                            )
                                        })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Sprint</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="sprintId"
                                    onChange={(e) => this.onInputChange(e)}>
                                        <option></option>
                                        {this.state.sprintovi.map(sprint => {
                                            return(
                                                <option key={sprint.id} value={sprint.id}>{sprint.ime}</option>
                                            )
                                        })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.dodajZadatak()}>Dodaj</Button>
                    </Col>
                </Row>

                <input type="checkbox" onChange={() => this.changeFormView()}/> Prikazi formu za pretragu

                {this.state.showForm &&
                    <div>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Ime zadatka</Form.Label>
                                        <Form.Control
                                            as="input"
                                            type="text"
                                            name="imeSearch"
                                            onChange={(e) => this.onSearchCange(e)}>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Sprint</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="sprintSearch"
                                            onChange={(e) => this.onSearchCange(e)}>
                                                <option value={-1}></option>
                                                {this.state.sprintovi.map(sprint => {
                                                    return(
                                                        <option key={sprint.id} value={sprint.id}>{sprint.ime}</option>
                                                    )
                                                })}
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                                <Button variant="primary" onClick={() => this.getZadaci(0)}>Search</Button>
                            </Col>
                        </Row>
                    </div>
                }
                
                <br/><br/>
                <div style={{textAlign: 'right'}}>
                    <Button disabled={this.state.pageNo == 0} onClick={() => this.getZadaci(this.state.pageNo - 1)} variant="primary">Prev</Button>
                    <Button disabled={this.state.pageNo == this.state.totalPages - 1} onClick={() => this.getZadaci(this.state.pageNo + 1)} variant="primary">Next</Button>
                </div>
                <Table style={{marginTop: 5, marginBottom:35}} >
                    <thead>
                        <tr style={{backgroundColor: '#343a40', color: 'white'}}>
                            <th>Ime</th>
                            <th>Zaduzeni</th>
                            <th>Bodovi</th>
                            <th>Stanje</th>
                            <th>Sprint</th>
                            <th>Actions</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderZadaci()}
                    </tbody>
                </Table>

                {this.state.sprintSum != ""? <h2>Sum for Choosen Sprint: {this.state.sprintSum}</h2>: null}
            </div>
        );
    }
}

export default Zadaci;