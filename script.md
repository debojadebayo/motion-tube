I want you to imagine that you work at a huge company, one of those Fortune 500 behemoths.

One day, as part of his grand vision, the CEO gets up and announces his plan. He wants a record of everything that the company knows, every protocol, every decision, every process.

And he wants to make it searchable so that any employee can find what they're looking for at the time. His argument? It'll make you all tons more productive. Now, putting aside the dubious claims for a moment, how does one actually go about building something like this?

Before computers, this would have been a gargantuan task. Hundreds of employees. Years of effort to build a sort of library. With computers, we can organize things millions of times faster. There is a little problem though. Computers don't quite understand language in the same way we do.

For example, let's take the terms, uh, customer churn and client attrition. Now, as humans, we know that those two things mean essentially the same thing. But to a computer, those are two completely different strings of text.

It turns out, however, that if you can represent those words as a series of numbers, you can do some pretty incredible things.

We call this list of numbers embeddings, and they sit at the heart of technologies like ChatGPT.

Think of each embedding as a set of coordinates in imaginary space. On a map, which is only two dimensions, we only need two numbers to find any location, an X coordinate to tell us how far along, and a Y coordinate to tell us how far up.

An embedding essentially does the same thing, just with hundreds of numbers rather than two.

In that space, distance means difference. So going back to our initial example, customer churn would sit here, client attrition next door, and some information about the end of year party perhaps over here.

So let's convert all of our documents into a list of embeddings. Now, the computer can, in some sense, understand them.

The next thing we need is a way to store them, and the simplest way is in one big list.

Then whenever someone asks a question, what we can do is turn that question into an embedding that the computer can understand and compare it with the list that we already have.

Let's call this the brute force method. It's simple, it's reliable, and it works quite well. There is a problem though.

Comparing your question embedding with the documents requires you to multiply hundreds of numbers together and add them up for each document. Now, if we only have a few thousand of these documents, our processor can handle that no problem in about under a millisecond or so. But remember, we're working at a Fortune 500 company.

We can have tens, maybe hundreds of millions of documents.

At 100 million documents, that calculation can take 10 seconds. At a billion, over a minute. Can you see what's going on here?

The work grows in direct proportion to the number of documents. In computer science, we call that linear time complexity, or O of N for short.

If you have 10 times the number of documents, you have to do 10 times the amount of work.

So can we do better than a list? Well, it turns out we can, and the solution comes from an old branch of mathematics called graph theory.

The idea is actually pretty simple. Imagine I asked you to draw your friendship group.

You probably wouldn't write everyone's name down in a long list. Instead, what you might do is draw a circle for each person and maybe draw lines between the persons to know who's knows who.

That is a graph. Each person is what we call a node, and each connection is an edge.

And what's more, this diagram tells us something that the list couldn't, how people know each other. If you want to, for example, chat with Margaret, you speak to Daniel, who knows Femi, who can put you in touch with Emmanuel, who can chat to Margaret.

Now let's go back to our document embeddings. And rather than a long list, let's start connecting these documents together.

We can connect each one to a handful of neighbors, knowing that if they are relatively close in our imaginary space, they're gonna be relatively similar.

Suddenly we have a network we can navigate.

Of course, we don't know in advance which document holds the answer to our question, but we don't need to.

We can start with any document, look at its neighbors, and step to the one which is closest to our question.

Then we repeat: look, calculate which is closest, and then take a step in that direction.

It's important to know that the work of constructing a graph, building relationships between our documents, does take a lot of work at the beginning.

But what it allows us to do is do far less work whenever we have a question. How much less? Well, it does vary depending on the graph.

But in one published experiment with a library of about 50,000, researchers found that they could find the answers to questions in as little as 900 odd jumps, or about two percent of the library.

So we like our graph idea. Let's start building it. Well, the obvious approach would go like this.

We go back in our imaginary space and we connect each document to 10 of those neighbors. How do we find those neighbors? Well, we look through all of our documents and find the 10 closest neighbors to them. Wait, that sounds familiar.

Isn't that what we were trying to avoid in the first place? Comparing one document with every other document was what we were trying to avoid in the list.

With 100 million documents, that's one document comparing with 100 million documents doing that 100 million times. That's even worse than the list.

Okay, so that doesn't work. Well, how about we do something a little different?

Let's try building the graph as we go along. Instead of uploading every single document we have and only afterwards making connections, let's start with a small subset of those documents. Let's say 100 or so.

That's cheap enough computationally speaking to compare one document with all the others.

So we construct our graph with these 100 documents. Then document 101 arrives.

We don't need to compare it with all of the other hundred documents anymore because we have our graph. We can just start anywhere in the graph and then use our graph approach to find out which neighbor is nearest to document 101.

Once we find the neighbor that's closest, we make our connection.

We have, however, created another problem. To understand this one a little better, let's tell a story. So it's the 1990s.

There's no Google Maps, no sat nav, and you've left your trusty A to Z at home.

Your mate has recommended what he swears is the best Nigerian restaurant in town. There's only one problem. It's in Enfield and you're in Brixton.

You know roughly where Enfield is, north, and you've got a pretty good sense of direction. How hard could it be?

So you set off, and at every junction, you follow one rule: take the road that leads north.

For a while, this works beautifully. You're heading north, you're getting closer to your destination. You can literally taste the shaki and jollof rice.

Then you hit a dead end. Perhaps it's a railway line with no way across, or a cul-de-sac.

Any road that you take from here will obviously lead you in the opposite direction to where Enfield is. And because you've got this rule of only taking roads that lead north, you're stuck. So let's go back to our documents embeddings.

Remember when we were trying to insert the 101st document? Let's say we start at document two, but this could be any document. We move to document 27 because the embedding is closer to document 101 than it is to two.

From document 27, we discovered document 43, which is closer still.

But then we hit our railway line. Every document connected to 43 is less good than 43 is.

Our simple strategy can't find anywhere better to go, so we make the connection to 101, that document 43. Problem solved, right? That's our algorithm working as it should. But how do we know that perhaps there's another document that wouldn't be even better?

In reality, there was a document 57 that was even better than 43, but because we started with document two, we had no way of getting to 57 without taking a path that was worse.

This is what we call a local minimum, finding the closest document in a certain neighborhood, but not actually in the whole graph.

Worse still, we've added 101 to the wrong part of the graph, which means when we follow with other documents, we navigate through that badly connected graph.

So how do we compensate for this?

Well, let's take a look back at our journey to Enfield. Why did we get stuck at a dead end?

Because at every junction, we only committed to the best road or the road that leads north. This is what we call a greedy approach. Every time you make a decision, you take the best possible decision at that time.

But while that works in some cases, it doesn't really work in map navigation.

Sometimes a road that looks slightly worse right now is the actual road that gets us there. Maybe it points off course for a bit, but it's the only way around the railway line.

So we need a little flexibility. In the same way, we can be more flexible when building our graph.

Rather than connecting a document to its absolute closest neighbors, which will all probably sit in the same region.

We favor variety. Here's how we'll adjust.

We begin with a list of promising neighbors, but our neighbor only makes the cut if it's both close to our existing document and leads in a direction where the others don't.

That way, every document has a road which leads off in a different direction.

Meaning that the graph is way more navigable than it was before.

Another problem with the navigation rule in our story is that we didn't account for A roads and motorways.

These may not have been strictly the best route to take, but we know that they would have gotten us to our destination much faster.

So how do we build the concept of motorways and A roads in our graphs?

As it turns out, graph theory has a solution for that too. Rather than building one large graph, we build a series of graphs stacked on top of each other, like floors in a building.

On the ground floor, floor zero, all of the documents exist.

We, however, assign a maximum height to each document in such a way that each successive floor has fewer and fewer documents.

Why is this helpful? On floor zero, each document is surrounded by very similar documents.

Connect each one to just a handful of them and you get these tight little clusters.

But on the first floor, there are far fewer documents, and so the connections inevitably are slightly longer. On the second floor, longer still. And by the time you get to the third floor, you've got these great big connections which connect one document to another document across the graph.

So let's go back to our example of inserting document 101. We start with the document on the top floor. We enter the graph and find its closest neighbor. But because we know it's at the top floor, we know we can take a great big jump through space much deeper into the graph.

Now, we don't find any neighbors that are better than that neighbor at the top floor, and so we drop down a floor and see if there are any neighbors there. We can make some further progress still at the floor below. When we've exhausted all the nodes at that floor, we can drop down even further.

Can you see what's happening? It's like we're taking the motorway to get into the general neighborhood, then we're dropping down into the side streets to find the exact location.

Now, this technique is called, believe it or not, hierarchical navigable small worlds. Now, don't look at me, I didn't invent this term.

But we can see it's a much more efficient way to navigate our graph of documents.

The benefits really start to show at great scales.

So to recap, we converted our documents into embeddings, and that allows the computer to understand the documents. Two, rather than connecting them in a list, we connected them in a graph, allowed us to relate one document to another. And third, rather than creating one large graph, we created a series of stacked graphs to allow us to better navigate and find the actual nearest relevant document.

Now we haven't covered the limitations of this technique. HNSW does have significant trade-offs, like the amount of memory that it requires.

If you want me to make a video about it or you have any questions, just shoot me a message in the comments.

So thanks so much for watching. I've put the original paper in the link below, um, and also a really great explainer by a chap called Wilson Lin, which helped me create this video. So if you enjoyed this, please like and subscribe.

See you next time.
