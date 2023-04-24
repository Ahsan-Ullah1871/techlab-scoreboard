// ALL ELEMENTS
const All_matches_box = document.querySelector(".all-matches");
const Add_match_btn = document.querySelector(".lws-addMatch");
const Reset_match_btn = document.querySelector(".lws-reset");
const Increment_submit = document.querySelectorAll("form");
const Decrement_submit = document.querySelectorAll(".decrementForm");
const Match_result = document.querySelectorAll(".lws-singleResult");

//ALL ACTION TYPES
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESTORE = "restore";
const ADDMATCH = "add_match";

// Initial State
const initialState = {
	matches: [{ id: "match-1", data: 0 }],
};

// Reducer functions
const matchReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADDMATCH:
			const newMatch = {
				id: `match-${state.matches.length + 1}`,
				data: 0,
			};
			return {
				...state,
				matches: [...state.matches, newMatch],
			};
		case INCREMENT:
			const match_id = action.payload.match_id;
			const value = action.payload.increment_value;
			return {
				...state,
				matches: state.matches.map((match, index) =>
					match.id === match_id
						? {
								...match,
								data:
									match.data +
									value,
						  }
						: match
				),
			};
		case DECREMENT:
			const match_id2 = action.payload.match_id;
			const value2 = action.payload.decrement_value;
			return {
				...state,
				matches: state.matches.map((match, index) =>
					match.id === match_id2
						? {
								...match,
								data:
									Number(
										match.data -
											value2
									) >= 0
										? match.data -
										  value2
										: 0,
						  }
						: match
				),
			};

		case RESTORE:
			return {
				...state,
				matches: state.matches.map((match, index) => {
					return {
						...match,
						data: 0,
					};
				}),
			};

		default:
			return state;
	}
};

//  create store
const store = Redux.createStore(matchReducer);

// add match
Add_match_btn.addEventListener("click", (event) => {
	store.dispatch({ type: ADDMATCH });
});

//Increment & Decrement Event
All_matches_box.addEventListener("submit", (e) => {
	e.preventDefault();
	if (e.target.classList.contains("incrementForm")) {
		const match_div = e.target.closest(".match");
		const match_id = match_div.id;
		const increment_value = parseInt(
			e.target.querySelector(".lws-increment").value
		);

		console.log(increment_value, match_id);
		store.dispatch({
			type: INCREMENT,
			payload: { match_id, increment_value },
		});
	} else if (e.target.classList.contains("decrementForm")) {
		const match_div = e.target.closest(".match");
		const match_id = match_div.id;
		const decrement_value = parseInt(
			e.target.querySelector(".lws-decrement").value
		);
		store.dispatch({
			type: DECREMENT,
			payload: { match_id, decrement_value },
		});
	}
});

// Restore match value
Reset_match_btn.addEventListener("click", (event) => {
	store.dispatch({ type: RESTORE });
});

// Subscribe and render function

const render = () => {
	const state = store.getState();

	const matches_ui = state.matches
		.map(
			(match, index) =>
				` <div class="match" id=${
					match.id
				}><div class="wrapper">
        <button class="lws-delete">
          <img src="./image/delete.svg" alt="" />
        </button>
        <h3 class="lws-matchName">Match ${index + 1}</h3>
      </div>
      <div class="inc-dec">
        <form class="incrementForm">
          <h4>Increment</h4>
          <input type="number" name="increment" class="lws-increment" />
        </form>
        <form class="decrementForm">
          <h4>Decrement</h4>
          <input type="number" name="decrement" class="lws-decrement" />
        </form>
      </div>
      <div class="numbers">
        <h2 class="lws-singleResult" id="${match.id}-result">${match.data}</h2>
      </div></div>`
		)
		.join("");

	All_matches_box.innerHTML = matches_ui;
};

store.subscribe(render);
