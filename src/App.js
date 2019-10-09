import React,{Component} from 'react';
import ReactDOM from "react-dom";
import './App.css';

class App extends React.Component {
	state = {
		text: '',
		inputValue: '',
		lastLetter: '',
		words: [],
		completedWords: [],
		completed: false,
		startTime: undefined,
		timeElapsed: 0,
		wpm: 0,
		started: false,
		progress: 0
	};

	setText = () => {
		const texts = [
			`Let us imagine that you are in a race with a tortoise. The tortoise has a ten-yard head start. In the time it takes you to run that ten yards, the tortoise has moved one yard. And then in the time it takes you to make up that distance, the tortoise goes a bit farther, and so on forever. You are faster than the tortoise but you can never catch him; you can only decrease his lead.`,
			`Plumbers have everything: greed, sex, spirituality, white-knuckled chases, shameful propositions, a nun, humor, true love, jaded love, taut action, comedy, a bad guy, a good guy, a hero, spine-tingling suspense, a hot babe, a damsel in distress, and a Hollywood ending!`,
			`Well, a scavenger hunt is exactly like a treasure hunt, except in a treasure hunt you try to find something you want, and in a scavenger hunt you try to find something that nobody wants.`
		];
		const text = texts[Math.floor(Math.random() * texts.length)];
		const words = text.split(' ');

		this.setState({
			text,
			words,
			completedWords: []
		});
	};

	startGame = () => {
		this.setText();

		this.setState({
			started: true,
			startTime: Date.now(),
			completed: false,
			progress: 0
		});
	};

	handleChange = e => {
		const { words, completedWords } = this.state;
		const inputValue = e.target.value;
		const lastLetter = inputValue[inputValue.length - 1];

		const currentWord = words[0];

		// if space or '.', check the word
		if (lastLetter === ' ' || lastLetter === '.') {

			// check to see if it matches to the currentWord
			// trim because it has the space
			if (inputValue.trim() === currentWord) {
				// remove the word from the wordsArray
				// cleanUp the input
				const newWords = [...words.slice(1)];
				const newCompletedWords = [...completedWords, currentWord];

				// Get the total progress by checking how much words are left
				const progress =
					(newCompletedWords.length /
						(newWords.length + newCompletedWords.length)) *
					100;
				this.setState({
					words: newWords,
					completedWords: newCompletedWords,
					inputValue: '',
					completed: newWords.length === 0,
					progress
				});
			}
		} else {
			this.setState({
				inputValue,
				lastLetter
			});
		}

		this.calculateWPM();
	};

	calculateWPM = () => {
		const { startTime, completedWords } = this.state;
		const now = Date.now();
		const diff = (now - startTime) / 1000 / 60; // 1000 ms / 60 s

		// every word is considered to have 5 letters
		// so here we are getting all the letters in the words and divide them by 5
		// "my" shouldn't be counted as same as "deinstitutionalization"
		const wordsTyped = Math.ceil(
			completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
		);

		// calculating the wpm
		const wpm = Math.ceil(wordsTyped / diff);

		this.setState({
			wpm,
			timeElapsed: diff
		});
	};

	render() {
		const {
			text,
			inputValue,
			completedWords,
			wpm,
			timeElapsed,
			started,
			completed,
			progress
		} = this.state;

		if (!started)
			return (
				<div className='container'>
					<h2>Welcome to the Typing game</h2>
					<p>
						<strong>Rules:</strong> <br />
						Type in the input field the highlighted word. <br />
						The correct words will turn <span className='green'>green</span>.
						<br />
						Incorrect letters will turn <span className='red'>red</span>.
						<br />
						<br />
						Have fun! 😃
					</p>
					<button className='start-btn' onClick={this.startGame}>
						Start game
					</button>
				</div>
			);

		if (!text) return <p>Loading...</p>;

		if (completed) {
			return (
				<div className='container'>
					<h2>
						Your WPM is <strong>{wpm}</strong>
					</h2>
					<button className='start-btn' onClick={this.startGame}>
						Play again
					</button>
				</div>
			);
		}

		return (
			<div>
				<div className='wpm'>
					<strong>WPM: </strong>
					{wpm}
					<br />
					<strong>Time: </strong>
					{Math.floor(timeElapsed * 60)}s
				</div>
				<div className='container'>
					<h4>Type the text below</h4>
					<progress value={progress} max='100'></progress>
					<p className='text'>
						{text.split(' ').map((word, w_idx) => {
							let highlight = false;
							let currentWord = false;

							// this means that the word is completed, so turn it green
							if (completedWords.length > w_idx) {
								highlight = true;
							}

							if (completedWords.length === w_idx) {
								currentWord = true;
							}

							return (
								<span
									className={`word 
                                ${highlight && 'green'} 
                                ${currentWord && 'underline'}`}
									key={w_idx}>
									{word.split('').map((letter, l_idx) => {
										const isCurrentWord = w_idx === completedWords.length;
										const isWronglyTyped = letter !== inputValue[l_idx];
										const shouldBeHighlighted = l_idx < inputValue.length;

										return (
											<span
												className={`letter ${
													isCurrentWord && shouldBeHighlighted
														? isWronglyTyped
															? 'red'
															: 'green'
														: ''
												}`}
												key={l_idx}>
												{letter}
											</span>
										);
									})}
								</span>
							);
						})}
					</p>
					<input
						type='text'
						onChange={this.handleChange}
						value={inputValue}
						autofocus={started ? 'true' : 'false'}
					/>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));


// SOCIAL PANEL JS
export default App;