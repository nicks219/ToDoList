import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class ReadEntries extends Component {
    static displayName = ReadEntries.name;
    page = 0;
    problemStatuses = { a: '1' };
    filter = 6;

    constructor(props) {
        super(props);
        this.state = { backlog: [], problemStatuses: [], loading: true };
    }

    componentDidMount() {
        this.getProblemStatus();
        //console.log(this.state.problemStatuses);
        this.getEntriesData();
    }

    back = () => {
        this.page--;
        this.getEntriesData();
    }

    forw = () => {
        this.page++;
        this.getEntriesData();
    }

    select = (e) => {
        //id � �� ���������� �� �������
        this.filter = Number(e.target.value) + 1;
        this.getEntriesData();
    }

    expired = {
        backgroundColor: "#FF0000"
    }

    checkVailidity = (backlog) => {
        //backlog.deadline
        //backlog.taskStatus.problemStatusName
        return false;
    }

    renderBacklogTable(backlog) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr key={"button"}>
                        <th>
                            <button onClick={this.back} className="btn btn-info">&lt;BACK</button>
                        </th>
                        <th>
                            <button onClick={this.forw} className="btn btn-info">FORW&gt;</button>
                        </th>
                        <th>
                            <Link to='/seed-db' className="btn btn-info">RET</Link>
                        </th>
                        <th>
                            <select onChange={this.select} >
                                {this.state.problemStatuses.map((a, i) =>
                                    <option value={i} key={i.toString()}>
                                        {a.problemStatusName}
                                    </option>
                                )}
                                {/*{ console.log(this.state.problemStatuses) }*/}
                                {/*{console.log(backlog)}*/}
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>Title</th>
                        <th>Initiator</th>
                        <th>Executor</th>
                        <th>Start Date</th>
                        <th>Deadline</th>
                        <th>Completion Date</th>
                    </tr>
                </thead>
                <tbody>
                    {backlog.map(backlog =>
                        <React.Fragment key={backlog.entryId}>
                            <tr style={{ backgroundColor: this.checkVailidity(backlog) == true ? "white" : "red" }}>
                                <td><Link to={{ pathname: '/update', propsState: backlog.entryId }}>{backlog.title}</Link></td>
                                <td>{backlog.initiator.name}</td>
                                <td>{backlog.executor.name}</td>
                                <td>{backlog.deadline}</td>
                                <td>{backlog.startDate}</td>
                                <td>{backlog.completionDate}</td>
                            </tr>
                            <tr>
                                <th colSpan="2" scope="row">Description</th>
                                <td colSpan="3" style={{ display: '' }}>
                                    <textarea id={backlog.entryId} value={backlog.description} cols={66} rows={8} onChange={this.inputText} />
                                </td>
                            </tr>
                        </React.Fragment>
                    )}


                </tbody>
            </table>
        );
    }

    inputText = (e) => {
        // get number of element property 'id':
        var id = Number(e.target.id);

        const newText = e.target.value;
        // �� ������ ������ json'��, � �� ���� json
        const data = [{ description: newText, initiator: { name: '' }, executor: { name: '' }, entryId: '1' }];
        this.setState({ backlog: data });
    }

    // display: 'none' display: ''
    //style = {{
    //                ...styles.productOptions,
    //    backgroundColor: checkedButton === item.id ? "grey" : "white",
    //              }}
    render() {
        let contents = this.state.loading
            ? <p><em>Please wait...</em></p>
            : this.renderBacklogTable(this.state.backlog);

        return (
            <div>
                <h1 id="tabelLabel" >Backlog</h1>
                <p>This component is under development.</p>
                {contents}
            </div>
        );
    }

    async getEntriesData() {
        const response = await fetch('entry/ongetpage?page=' + this.page + "&filter=" + this.filter);
        const data = await response.json();
        if (data != null && data.length > 0) this.page = data[0].currentPage;
        this.setState({ backlog: data, loading: false });
    }

    async getProblemStatus() {
        const response = await fetch('entry/ongetproblemstatuses');
        const data = await response.json();
        this.setState({ problemStatuses: data });
    }
}