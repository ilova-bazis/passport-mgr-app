import React from 'react';
import {Typography, RadioGroup, Radio, Grid, FormControlLabel} from '@material-ui/core';

class DocumentMgr extends React.Component {


    constructor(props){
        super(props);
        this.setDocumentType = this.setDocumentType.bind(this);
    }

    setDocumentType(e) {

        this.props.setDocumentType(e);
    }

    render(){
        return (
            <Grid>
                <Typography variant='h5'>Document Manager steps:</Typography>
                <RadioGroup aria-label="gender" name="gender1" value={this.props.specs.type} onChange={this.setDocumentType}>
                    <FormControlLabel value="TAJIK_FOREIGN_PASSPORT_MAIN_PAGE" control={<Radio />} label="Passport" />
                    <FormControlLabel value="TAJIK_ID_FRONT_PAGE" control={<Radio />} label="ID Card Front" />
                    <FormControlLabel value="TAJIK_ID_BACK_PAGE" control={<Radio />} label="ID Card Back" />
                    <FormControlLabel value="SELFIE_PHOTO" control={<Radio />} label="Selfie" />
                </RadioGroup>
            </Grid>
        )
    }
}

export default DocumentMgr;