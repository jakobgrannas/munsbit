import React from 'react';

export default class ScrapeUrlBar extends React.Component {
	_currentUrl = '';
    _handleUrlChange = (e) => {
		this._currentUrl= e.target.value || '';
    };

	_handleSubmit = () => {
		this.props.handleChange(this._currentUrl);
	};

    render () {
        return (
            <div>
                <input type="text" onChange={this._handleUrlChange} />
				<button type="submit" onClick={this._handleSubmit}>Submit</button>
            </div>
        );
    }
}
