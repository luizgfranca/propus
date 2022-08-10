# Propus Report Engine

Propus is a Javascript report generation engine, it will make it really simple to include document generation in your javascript project.
As for other report tools to generate a report you just have to pass in a template with the desired style of the
document, and some data, and the document will be generated.

The current project has the code for:

- The first proof of concept (simple variable substitution done with regex)
- The current (work in progress) rewrite using a custom parser, witch will make possible the features I want.

## Motivation

When doing some personal and work projects I noticed there wasn't any optimal solutions for report generation in Nodejs. Some tools existed, but nothing comparable with what I saw in other languages.

This project aims to develop good functionality to do more complex reports that would otherwise create the need for a separate service in other language on the project architecture.

## Building and running

As said above, the project is currently in a rewrite, so there are two implementations here.

### Proof of concept

There are some examples that can be run in the `/example` directory. To run them you can use

```bash
ts-node example/solicitations.js
```

### Rewrite

The current progress rewrite still don't have any example, the interpreter is being built on the
`src/interpreter/phtml` folder, where there are some tests. To run the test suite use

```bash
yarn test
```
