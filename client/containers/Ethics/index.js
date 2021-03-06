import React from 'react'
import Markdown from 'react-markdown'
import Input from 'ui/Input'
import Checkbox from 'ui/Checkbox'
import Button from 'ui/Button'
import Select from 'ui/Select'
import { connect } from 'react-redux'
import * as TodoActions from 'actions/todos'
import { CountryDropdown as CountrySelect } from 'react-country-region-selector'

const source = `# ONLINE PARTICIPANT INFORMATION STATEMENT

*What is the research study about?*
You are invited to take part in this research study aimed at understanding behavior in a supply chain management game. 

*Who is conducting this research?*
The study is being carried out by the following researchers:
Chief Investigator: Sam Kishner
School/Faculty: School of Information Systems and Technology Management, Business School

*What does participation in this research require, and are there any risks involved?*
If you decide to take part in this research experiment, you will be provided with instructions on how to play a supply chain management game. Before the instructions on playing the game, you will complete a 6 question survey. We expect the survey, instructions and playing the game to take 10 - 15 minutes. 

*Will I be paid to participate in this project?*
You will be compensated for your participation. By participating in the study, you will receive $2 for completion and a bonus payment based on performance between $0 - $15. 

*What are the possible benefits to participation?*
We hope to use information we get from this research study to benefit others who are interested in improving supply chain decision making.

*What will happen to information about me?*
By completing the game, you consent to the research team collecting and using information for a research study. It is anticipated that the results of this research study will be published and/or presented in a variety of forums. In any publication and/or presentation, the results of the study will be presented in such a way that participants will not be individually identifiable.

The results of the experiment will be kept for a minimum of 7 years after the completion of the project. At this stage, we have no intention of destroying the data. If you agree to participate in this study, no personal information will be collected so none will be stored as data. Once we have completed our data collection and analysis, we will import the data we collect to the UNSW server. The data stored by the app will then be deleted. Both hard and electronic copies of the data will be securely stored by Dr. Sam Kirshner at Quad 2115 at the University of New South Wales in Sydney Australia. Electronic copies will be stored in Sam Kirshner's computer located in Quad 2115 with password protection. 

How and when will I find out what the results of the research study are?
You have a right to receive feedback about the overall results of this study. You can tell us that you wish to receive feedback by emailing the investigator, Dr Sam Kirshner, at s.kirshner@unsw.edu.au. This feedback will be in the form of a one page summary that describes the overall findings. You will receive this feedback after the study is finished.

What if I want to withdraw from the research study?
Finishing the game and questionnaire is an indication of your consent to participate in the study. You can withdraw your responses any time before finishing the game. Once you have submitted it, your responses cannot be withdrawn because they are anonymous and therefore we will not be able to tell which one is yours.

*What should I do if I have further questions about my involvement in the research study?*
The person you may need to contact will depend on the nature of your query. If you want any further information concerning this project or if you have any problems which may be related to your involvement in the project, you can contact the following member's of the research team:

*Research Team Contact*
Name: Dr Sam Kirshner
Position: Lecturer
Telephone: 9385 5517
Email: s.kirshner@unsw.edu.au

*What if I have a complaint or any concerns about the research study?*
If you have any complaints about any aspect of the project, the way it is being conducted, then you may contact: 
Position: Human Research Ethics Coordinator
Telephone: + 61 2 9385 6222
Email: humanethics@unsw.edu.au 
HC Reference Number: HC16680
`

const checks = [
  'I understand I am being asked to provide consent to participate in this research study',
  'I have read the Participant Information Statement or it has been provided to me in a language that I understand',
  'I provide my consent for the information collected about me to be used for the purpose of this research study only',
  'I freely agree to participate in this research study as described and understand that I am free to withdraw at any time during the study and withdrawal will not affect my relationship with any of the named organisations and/or research team members'
]

const initState = checks.reduce((finalResult, check) => {
  finalResult[check] = false
  return finalResult
}, {
  country: '',
  gender: '',
  age: '',
})

const genderOptions = [{
  value: 'male',
  label: 'Male'
}, {
  value: 'female',
  label: 'Female'
},
{
  value: 'other',
  label: 'Other'
},
{
  value: '',
  label: 'Choose Gender',
  default: true
}
]

class Ethics extends React.PureComponent {
  state = initState
  onChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }
  checkValid = () => {
    return Object.keys(this.state).reduce((finalResult, key) => {
      if (!finalResult) return finalResult
      if (key === checks[4]) {
        return true
      }
      if (!this.state[key]) return false
      return true
    }, true)
  }
  submit = () => {
    this.props.submit(this.state)
  }
  onSelectCountry = (val) => {
    this.onChange('country', val)
  }
  render () {
    return (<div>
      <Markdown source={source} />
      <h3>Declaration of Participant</h3>
      {
        checks.map(check => {
          return <Checkbox label={check} checked={this.state[check]} onChange={this.onChange.bind(null, check)} />
        })
      }
      <div><span>Nationality: <CountrySelect value={this.state.country} onChange={this.onSelectCountry} /></span></div>
      <div><span>Gender Identity: <Select value={this.state.gender} onChange={this.onChange.bind(null, 'gender')} options={genderOptions}/></span></div>
      <div><span>Age (years): <Input type="number" value={this.state.age} onChange={this.onChange.bind(null, 'age')}/></span></div>
      <Button onClick={this.submit} disabled={!this.checkValid()}>I agree, start questionnaire</Button>
    </div>)
  }
}

const mapDispatchToProps = (dispatch) => ({
  submit: (payload) => dispatch(TodoActions.agreeEthics(payload))
})

export default connect(null, mapDispatchToProps)(Ethics)
