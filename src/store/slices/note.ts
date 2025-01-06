import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/lib/axios';

// ----------------------------------------------------------------------

const MOCK_NOTES = [
  {
    id: 1,
    user_id: 1,
    title: "Testing 1",
    content: `In negotiation ask: what would need to be true for you to move forward today? The big thing should be the first thing in the day Find the combination between the science of success and the art of fulfilment Dogs and kids have it figured out. All play When creating a plan. Have step a, b and z. The first two to get the ball rolling and then the end goal (abstract) Be wary of 10 out of 10 of execution on a 2 out of 10 opportunity No is saying no to one thing. Yes is saying no to a whole lot more things When someone asks something of you \
   that builds a €50m ARR business What is the work that keeps working for you Every idea we have is almost always downstream from the media, we consume If busy, reduce the scope but stick to the habit Annual review questions by James clear What you resist, 
       persists Having a world class understanding of your customers problem is the key to creating a successful business In creative pursuits, stop something in the proverbial midsentence, so that next time I sit down, I can pick it up and get first successes easily Creativity is a generous act. Get out of your own way. don’t ask for a guarantee, just simply ship the work. Without dialogue and without drama Process saves us from the poverty of our intention I’m an entrepreneur and entrepreneurs work every day on their business What do you believe that many people 
       wouldn’t agree with “A healthy person wants a thousand things, a sick person only wants one.” Confuscious When I'm building a company, the first thing I need to do is figure out where my customers habg out When someone is strugglign with somethign to the Gabor mate exercise In a webinar reach out to 1-2 attendees before the session and ask them before hand if I can ask them a question during the session Conventional thinking is typically right, but seldom profitable 3 questions at networking event Brag - this is what I’m really good at Ask - something that I want Give - something that 
       I can give The greatest risk is not taking one At work, action produces information Customer inspired problem lead innovation I am over thinking that I know what is best for me and instead I’ll surrender to life I can never, never control any external outcome. What I can control is my internal dialog and serenity I only need control of the future if I’m living in fear I use external triggers to remind me of my internal essence I get triggered by external situations it reminds me of my essence and that I am abundance of that and everything already Who I am is everything that I’m looking for In the presence of love and compassion there is an opportunity for powerful transformation Love is active listening Fully accepting my history/my past and trusting my future In the dissolution of the idea of yourself then or you are left with is
        freedom The person trying to get rid of their ego, is the ego Pre morten and pre parade Freedom from self can be achieved through integration and love and acceptance. Do this by loving and accepting all flaws Most relationships don’t work because people are asking the other person to be the nervy they won’t be for themselves Peter crone on preparing for a podcast Life plié play. Play is unselfconscious absorption in the moment in a way that allows me to be totally creatively present Jackson Browne once said that he writes to find out what he thinks. 3 things you can do: accept, ignore or change Community (family and friends), craft (professional and leadership), constitution (health), contemplation (matters of the soul) Wherever you go spread the gospel, when absolutely necessary, use words - Lewis You know what it takes to realise your dreams? It takes whatever it takes Never have more than 5% in one stock. 
        Never have more than 20% in one industry Be curious, when you feel furious Think like a scientist, not a prosecutor Think like an engineer, not a lawyer Identify which game you’re playing. Most people don’t even define which game they’re playing and then end up losing at all games Pull on a thread “A genius is the one most like himself.” – Thelonious Monk Sometimes your greatest hopes are destroyed to prepare you for something better Relax your face throughout the day Teaching forces learning Great question to ask Boris and Benn. What do you think I am not seeing clearly? Average vs. Distribution. Average net worth of people in a bar is 100k and then 1billion When writing don’t have your genesis/creative engine and editing engine running at the same time Lead, follow or get out of the way Bring humanity to everything that you do When making a business decision with limited information. With emotionally hard topics, I should face, 
         The great business man is thrifty (also with little to no overhead), despises inefficiencies (little to no bureaucracy) and is regularly in the front lines and in the trenches A great business is non conformist, doing things differently than their competitors. Not following traditional norms and set ups Never interrupt the compounding A good plan executed violently today is better than a perfect plan next week My philosophy for life Bird fly, fish swim and deals fall through At some point you realise it’s all made up, but I get to make it up. The rules are made up, everything is made up. And I can make up the rules as well`,
    source: "upload",
  },
  {
    id: 2,
    user_id: 2,
    title: "Testing 2",
    content: `tst`,
    source: "upload",
  },
  {
    id: 3,
    user_id: 2,
    title: "Testing 3",
    content: `tst`,
    source: "upload",
  },
  {
    id: 4,
    user_id: 2,
    title: "Testing 4",
    content: `tst`,
    source: "upload",
  },
  {
    id: 5,
    user_id: 2,
    title: "Testing 5",
    content: `tst`,
    source: "upload",
  },
  {
    id: 6,
    user_id: 2,
    title: "Testing 6",
    content: `tst`,
    source: "upload",
  },
  {
    id: 7,
    user_id: 2,
    title: "Testing 7",
    content: `tst`,
    source: "upload",
  },
  {
    id: 8,
    user_id: 2,
    title: "Testing 8",
    content: `tst`,
    source: "upload",
  },
  {
    id: 9,
    user_id: 2,
    title: "Testing 12",
    content: `tst`,
    source: "upload",
  },
  {
    id: 10,
    user_id: 2,
    title: "Testing 14",
    content: `tst`,
    source: "upload",
  },
  {
    id: 11,
    user_id: 2,
    title: "Testing 71",
    content: `tst`,
    source: "upload",
  },
];

type INote = {
  id: number;
  title: string;
  content: string;
  source: string;
}

type INoteInitialState = {
  isLoading: boolean,
  error: any,
  notes: INote[],
  note: INote | null
  selectedNotes: INote[] | null
}


const initialState: INoteInitialState = {
  isLoading: false,
  error: null,
  notes: [],
  note: null,
  selectedNotes: []
};


const slice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getNotesSuccess(state, action) {
      state.isLoading = false;
      state.notes = action.payload.notes;
    },

    setSelectedNote(state, action) {
      state.isLoading = false;
      state.note = action.payload;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelectedNote } = slice.actions;

// ----------------------------------------------------------------------

export function getNotes() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get(`/api/notes`);
      const response = {data: MOCK_NOTES}
      dispatch(
        slice.actions.getNotesSuccess({
          notes: response.data,
        }),
      );
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------
