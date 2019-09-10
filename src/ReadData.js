import React from 'react';
import readXlsxFile from 'read-excel-file';

export default class ReadData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finalData: []
        };
    }

    prepareData = () => {
        const getData = this.state.finalData.map(
            (ele, index) => {
                return (
                    <div className="tableRow" key={index}>
                        <div className="tableColumn">{ele[0]}</div><div className="tableColumn">{ele[1]}</div>
                    </div>
                );
            }
        );
        return getData;
    };

    fetchRow = (elements, index, data) => {
        const valuePairs = [];
        let tempValue = [];
        const filteredData = elements.filter(e => e !== null);
        if (filteredData.length === 2) {
            valuePairs.push(filteredData);
        } else {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i] === null) {
                    i = i + 1;
                    continue;
                } else {
                    if (data[index + 1] && data[index + 1][i] === null) {
                        i = i + 1;
                        continue;
                    } else {
                        tempValue.push(elements[i]);
                        if (tempValue.length === 2) {
                            valuePairs.push(tempValue);
                            tempValue = [];
                        }
                    }
                }
            }
        }
        return valuePairs;
    };

    processExceldata = data => {
        const updatedData = [];
        data.forEach((element, index) => {
            const rowDate = this.fetchRow(element, index, data);
            if (rowDate && Array.isArray(rowDate) && rowDate.length > 0) {
                rowDate.forEach(
                    ele => updatedData.push(ele)
                );
            }
        });
        this.setState({
            finalData: updatedData
        });
    };

    componentDidMount() {
        const input = document.getElementById('input');
        if (input) {
            input.addEventListener('change', () => {
                readXlsxFile(input.files[0]).then((rows) => {
                    this.processExceldata(rows);
                })
            });
        }
    }
    render() {
        const { finalData } = this.state;
        const dataToDisplay = finalData.length > 0 ? this.prepareData() : null;
        return (
            <div className="excelData">
                <div className="inputFields">
                    <input type="file" id="input" />
                </div>
                <div>
                    {dataToDisplay}
                </div>
            </div>
        );
    }
}