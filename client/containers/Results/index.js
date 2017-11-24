import React from 'react'
import Markdown from 'react-markdown'
import Button from 'ui/Button';
import { connect } from 'react-redux';
import $ from 'jquery';


class Results extends React.PureComponent {
  submit = ()=>{
    $('#results').closest('form').submit()
  }
  render(){
    return <div>
      <h3>Final Results</h3>
      <p>{`Thank you for completing the game. Your total cumulative profit was $${this.props.profit}`}</p>
      <Button onClick={this.submit}>Submit Results</Button>
    </div>
  }
}

const mapStateToProps = (state)=>{
  const lastResultIndex = state.todos.results.length - 1;
  return {
    profit: state.todos.results[lastResultIndex].cumulativeProfit
  }
}

export default connect(mapStateToProps)(Results)