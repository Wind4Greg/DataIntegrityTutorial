# Verifiable Credentials Data Integrity Tutorial

This tutorial aims to explain and demonstrate the use of verifiable credentials between small non-profit, non-governmental organizations.

It focuses on the following topics:

* A minimal use case for verifiable credentials
* A minimalistic design of a verifiable credential for an organization
* Choosing the data integrity mechanism for the verifiable credential
* Issueing and verifying the credential

If you have questions or would like to contribute. Drop me a note or post an issue.

## Example Application: A School/Community Club

When teaching begining and intermediate website development to computer science majors one of the authors of this tutorial would have students create a website for a real or fictional school or community club, such as a hiking club, a guitar club, a cooking club etc... They would develop this website from a simple static HTML page to a full front-end/back-end server based application with logins for club members and club officers with different views and club management capabilities based on membership/officer status.

From the perspective of a single school club verifiable credentials may not be required, however from the point of view of school clubs from different schools wanting to cooperate, verifiable credentials can be very useful. For example consider hiking clubs at two different schools. The purpose of the hiking clubs are to promote the "great outdoors", educate its members on hiking safely, and providing a variety of club organized hikes at a variety of difficulty levels. A single hiking club can keep track of its members, their hiking knowledge, and hiking achievements in a database associated with its website and managed through that website. If a member wishes to "sign up" for a hike the club can check (a) if the member is current in their dues, (b) do they have the knowledge necessary to safely go on this hike, (c) have they demonstrated that they can complete this hike by completing other hikes of a similar nature.

Now if hiking clubs at two or more different schools (or communities) wish to cooperate than exposing their general member information to each other would be problematic on many fronts. However, if the clubs were to issue credentials to their members and if the other clubs chose to accept those than cross club cooperation can be enabled. This tutorial will focus on this situation.

## Tutorial Development Process

I like to start most writing assignments by taking lots of notes and putting down lots of ideas. These are in the [DataIntegrityNotes.qmd](DataIntegrityNotes.qmd) file. I also prefer to work in Markdown. As an experiment I'm trying to use the [Quarto scientific/technical publishing system](https://quarto.org/) which utilizes Markdown and [Pandoc](https://pandoc.org/). Note that code examples, if any, will be in JavaScript for [Node.js](https://nodejs.org/en) as all the test vectors for the various Data Integrity cryptosuites that I generated were produced with JavaScript and also the test servers that I wrote to participate in the VC interoperability tests.

## Standards Covered



## Technology Utilized