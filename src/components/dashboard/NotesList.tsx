import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/use-notes";
import { Loader2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_NOTES = [
  {
    id: 1,
    user_id: 1,
    title: "Testing 123",
    content: `In negotiation ask: what would need to be true for you to move forward today? The big thing should be the first thing in the day Find the combination between the science of success and the art of fulfilment Dogs and kids have it figured out. All play When creating a plan. Have step a, b and z. The first two to get the ball rolling and then the end goal (abstract) Be wary of 10 out of 10 of execution on a 2 out of 10 opportunity No is saying no to one thing. Yes is saying no to a whole lot more things When someone asks something of you \
    
    What’s the non obvious key to this? Like only the person in the weeds would know this To creat a successful company you need 1. The right market 2. The right time 3. The right people. The first 2 are the most important to get things going Success is the summary of your attempts Starting up is doing as many jobs as possible to make sure your company doesn’t die. Scaling up is the act of shedding as much as possible to make sure that your company doesn’t die Every relationship argument is essentiall about. Do you really see me? Do you really understand me?
       Are you really going to be there for me when times are tough Writing is thoughts trapped on a page Peter crone Tell me every terrible thing you’ve ever done and 
      I’ll love you all the same. Have that conversation with myself Do it for the story **Be that 1 person for 1 person** **If 
      it’s not gonna matter in 5 years, don’t spend more than 5 minutes worrying or being upset about something** 
      Always WILL, never CAN Pressure is a privilege Misogi rule Kevin’s rule Take 3min to compliment, congratulate and console So hard things a lot 
      The struggle ends when the gratitude begins What am I unbeatable at and what am I dangerous at? The best relationship are transparently honest. But the honesty is always a gift, never a weapon Men tend to get lonelier when they get older, women tend not to. 
      60% of men above 60 say their wife is their best friend. % of women say their husband is their best friend Never do a naughty pleasure alone. Always add people and memory. That is why pornography is a problem Life satisfaction is haves/wants If you want to make a change so: state (you have to be happy), story, strategy Identify success gaps Using affiliate marketing Complexity is the enemy of execution
      When your business grows you become a capital allocator Buying businesses on flippa When stuck with a problem Victory through attrition In good times done be too happy as bad times will come. In bad times don’t be too sad, because good times will come Find people you love and then do life with them In meetings: what are the key questions we want to have answered by the end of this meeting? On death by the I am that author When there is anxiety Expanding the mind, heart and body If you just wait a little bit if time a lot of problems go away Don’t believe everything you think Strong opinions, loosely held 
      What do you know more about than most other people? Hardly anything is objectively good or bad It is never too late to have had a great childhood A bad day for the ego is a great day for the soul Suffering ends where meaning begins “Here is my secret. It is very simple: it is only with the heart that one can see rightly. What is essential is invisible to the eye.” Proximity is power -> try to be close to the people you like, 
      what to be inspired by There’s no problem everything is unified, and all I need to do is dissolve the perception that is in the way of that **Previous conditioning is stagnant and based in history** You can’t be held accountable for what you’re oblivious too The very fabric of life itself is uncertainty, the fact that we are looking for safety is the anthiseis of this. Abracadabra as I speak, so I create Words are creative not descriptive 
      Continue to evolve Your mind starts worrying about a future that hasn’t happened and then tries to protect itself from the outcome. Not realising that it was made up in the first place. Just stop the narrative No you no problem. Absence of you you can just be in flow with life and how it unfolds We do have The three main constructs of the ego are inadequacy scarcity and insecurity The nature of life is uncertainty The present and future Peter from If someone can only see my actions and not hear my words, what would they say my priorities
       are I am they type of person that builds a €50m ARR business What is the work that keeps working for you Every idea we have is almost always downstream from the media, we consume If busy, reduce the scope but stick to the habit Annual review questions by James clear What you resist, 
       persists Having a world class understanding of your customers problem is the key to creating a successful business In creative pursuits, stop something in the proverbial midsentence, so that next time I sit down, I can pick it up and get first successes easily Creativity is a generous act. Get out of your own way. don’t ask for a guarantee, just simply ship the work. Without dialogue and without drama Process saves us from the poverty of our intention I’m an entrepreneur and entrepreneurs work every day on their business What do you believe that many people 
       wouldn’t agree with “A healthy person wants a thousand things, a sick person only wants one.” Confuscious When I'm building a company, the first thing I need to do is figure out where my customers habg out When someone is strugglign with somethign to the Gabor mate exercise In a webinar reach out to 1-2 attendees before the session and ask them before hand if I can ask them a question during the session Conventional thinking is typically right, but seldom profitable 3 questions at networking event Brag - this is what I’m really good at Ask - something that I want Give - something that 
       I can give The greatest risk is not taking one At work, action produces information Customer inspired problem lead innovation I am over thinking that I know what is best for me and instead I’ll surrender to life I can never, never control any external outcome. What I can control is my internal dialog and serenity I only need control of the future if I’m living in fear I use external triggers to remind me of my internal essence I get triggered by external situations it reminds me of my essence and that I am abundance of that and everything already Who I am is everything that I’m looking for In the presence of love and compassion there is an opportunity for powerful transformation Love is active listening Fully accepting my history/my past and trusting my future In the dissolution of the idea of yourself then or you are left with is
        freedom The person trying to get rid of their ego, is the ego Pre morten and pre parade Freedom from self can be achieved through integration and love and acceptance. Do this by loving and accepting all flaws Most relationships don’t work because people are asking the other person to be the nervy they won’t be for themselves Peter crone on preparing for a podcast Life plié play. Play is unselfconscious absorption in the moment in a way that allows me to be totally creatively present Jackson Browne once said that he writes to find out what he thinks. 3 things you can do: accept, ignore or change Community (family and friends), craft (professional and leadership), constitution (health), contemplation (matters of the soul) Wherever you go spread the gospel, when absolutely necessary, use words - Lewis You know what it takes to realise your dreams? It takes whatever it takes Never have more than 5% in one stock. 
        Never have more than 20% in one industry Be curious, when you feel furious Think like a scientist, not a prosecutor Think like an engineer, not a lawyer Identify which game you’re playing. Most people don’t even define which game they’re playing and then end up losing at all games Pull on a thread “A genius is the one most like himself.” – Thelonious Monk Sometimes your greatest hopes are destroyed to prepare you for something better Relax your face throughout the day Teaching forces learning Great question to ask Boris and Benn. What do you think I am not seeing clearly? Average vs. Distribution. Average net worth of people in a bar is 100k and then 1billion When writing don’t have your genesis/creative engine and editing engine running at the same time Lead, follow or get out of the way Bring humanity to everything that you do When making a business decision with limited information. With emotionally hard topics, I should face, 
        feel and deal Candour by Jim Dehtmer In work. Are we more interested in being right than being successful as a team? 4 states of consciousness Pain is inevitable, suffering is optional Wonder questions. Questions that you live in that you sit in On how much money to make Things in excess become their opposite The more you sweat during peace, the less you bleed during war Original: one you learn to employ your weaknesses, they can become you strength. It’s only a weakness if it is not controlled by you Fight for your limitations and you get to keep them You can’t help but laugh when you realise the only thing that’s upsetting you is your imagination Responsibility has got nothing to do with fault and everything with power Founder values: force of will, bias to action, speed In branding, remember EPOC - every point of contact Change your words, change your life The most powerful people are people who are willing to give up their power Being right is the poor man’s version of self esteem Never wrestle a pig. You’ll both get dirty but the pig will enjoy it The goal is not to be well-known, but rather known well. Then people will share things and opportunities that are directly in your wheel house Sell pickaxes to goldminers You can only make great decisions while in a state of great energy. Do some pushups or laugh or
         The great business man is thrifty (also with little to no overhead), despises inefficiencies (little to no bureaucracy) and is regularly in the front lines and in the trenches A great business is non conformist, doing things differently than their competitors. Not following traditional norms and set ups Never interrupt the compounding A good plan executed violently today is better than a perfect plan next week My philosophy for life Bird fly, fish swim and deals fall through At some point you realise it’s all made up, but I get to make it up. The rules are made up, everything is made up. And I can make up the rules as well`,
    source: "upload",
  },
];

export default function NotesList() {
  const { notes, isLoading } = useNotes();
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  const handleNoteSelect = (noteId: number) => {
    setSelectedNote(noteId === selectedNote ? null : noteId);
    console.log({ selectedNote });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // if (!notes?.length) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6 text-center text-muted-foreground">
  //         No notes uploaded yet
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-4">
          {MOCK_NOTES.map((note) => (
            // {notes.map((note) => (
            <Card
              key={note.id}
              className={`cursor-pointer transition-colors ${
                selectedNote === note.id ? "border-primary" : ""
              }`}
              onClick={() => handleNoteSelect(note.id)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {note.content.length > 200
                    ? `${note.content.slice(0, 200)}...`
                    : note.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* {note.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))} */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      
    </div>
  );
}
