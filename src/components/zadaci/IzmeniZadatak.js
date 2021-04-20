import React, { Component } from 'react';
import {Col, Row, Button, Form} from 'react-bootstrap';
import SprintAxios from '../../apis/SprintAxios';

class IzmeniZadatak extends Component {
   
    state = {
        ime: '',
        zaduzeni: '',
        bodovi: '',
        stanjeId: '',
        sprintId: '',
        stanja: [],
        sprintovi: []
    }

    componentDidMount(){
        this.getZadatak();
        this.getStanja();
        this.getSprintovi();
    }

    getZadatak(){
        let id = this.props.match.params.id;

        SprintAxios.get("/zadaci/" + id)
            .then(res => {
                this.setState({
                    ime: res.data.ime,
                    zaduzeni: res.data.zaduzeni,
                    bodovi: res.data.bodovi,
                    sprintId: res.data.sprintId,
                    stanjeId: res.data.stanjeId
                })
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

    getSprintovi(){
        SprintAxios.get("/sprintovi")
            .then(res => {
                this.setState({sprintovi: res.data})
            })
            .catch(error => {
                console.log(error)
            })
    }

    onInputChange(e){
        let name= e.target.name;
        let value = e.target.value;

        let change = {}
        change[name] = value
        this.setState(change)
    }

    izmeniZadatak(){
        let id = this.props.match.params.id;

        let params = {
            id: id,
            ime: this.state.ime,
            zaduzeni: this.state.zaduzeni,
            bodovi: this.state.bodovi,
            sprintId: this.state.sprintId,
            stanjeId: this.state.stanjeId
        }

        SprintAxios.put("/zadaci/" + id, params)
            .then(res => {
                console.log(res.data)
                this.props.history.push(("/zadaci"))
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Izmeni zadatak</h1>

                <Row>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>Ime</Form.Label>
                                <Form.Control
                                    value={this.state.ime}
                                    as="input"
                                    type="text"
                                    name="ime"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Zaduzeni</Form.Label>
                                <Form.Control
                                    value={this.state.zaduzeni}
                                    as="input"
                                    type="text"
                                    name="zaduzeni"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Bodovi</Form.Label>
                                <Form.Control
                                    value={this.state.bodovi}
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
                                    value={this.state.stanjeId}
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
                                    value={this.state.sprintId}
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
                        <Button variant="primary" onClick={() => this.izmeniZadatak()}>Izmeni</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default IzmeniZadatak;