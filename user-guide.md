---
title: User Reference - Shell Agent Platform
---

# Introduction 

👋 Welcome to the Shell Agent User Guide!  

Here you’ll find everything you need to get started and make the most of Shell Agent, designed to teach you effectively and enjoyably.

> Getting Started

## Shell Agent Modes

### Command Mode
With `Command` mode you can run shell commands directly in your browser, in a secure and isolated environment. 

![command mode](/doc-imgs/cmd1.png)

- Change directory `cd newDirectory/`.
- List the files in a directory `ls`.

### Prompt Mode
With `Prompt` mode you can ask and learn from a language model, backed by a course material.

![prompt mode](/doc-imgs/cmd2.png)

- Ask questions about your course material.
- The model is aware of what you are doing in the terminal.

As you may notice, the initial path is `~` which is your home directory, it refers to `/home/user`. Inside that path you can do your work, create/read/edit files and folders.


# Scripts Writing

With regular use of the terminal, you may want to edit or create scripts using terminal editors like `nano` or `vim`.

Shell agent offers the same experience, just type `nano script.sh` or `vim script.sh` to create or edit a script.

Let's try it!:
- Create a script: `touch my_script.sh`.
- Add some content: `echo "Hello, Shell Agent!" > my_script.sh`.
- Open it with nano: `nano my_script.sh`.

Boom:
![editor 1](/doc-imgs/editor1.png)

Now you can ask with `Prompt` mode to get examples of scripts, or how to write a specific one.

![run script](/doc-imgs/terminal.png)

As you can see, the scripts can be executed directly from the terminal with this syntax `./script_name.sh`.

For safety reasons shell agent doesn't require you to change the permission of the script to make it executable, it's done automatically.

Script Editor doesn't accept inputs, so if your script requires user input, it won't work as expected.


![editor 2](/doc-imgs/editor2.png)


# Course Material Context

Shell agent is designed to help you learn effectively by providing context from your course material.

The web app uses RAG to power the language models with context from your course, so it understands and respond to your queries based on the content of the courses you are studying.

![course context](/doc-imgs/term-pdf.png)

As you may know this project is open source, you can clone shell agent and use an infrastructure to host your own courses of choice.

# Tabs Containerization

Tabs give you the ability to have multiple isolated terminal sessions running simultaneously.

Each tab is a separate container, which means that you can have multiple sessions running at the same time, each with its own environment and state.


## limitations
 - Each container has a limited lifespan (30min of inactivity).
 - Tabs expire after 30 min of creation.
 - Maximum of 6 tabs per user.
 - Each container has a limited storage space (200MB).
 - CPU usage is limited to 0.5 CPU. 

# Learn More 

Source Code - [Shell agent Github](https://github.com/aliaitrhou/shell-agent)

About Shell Agent - [https://www.aliaitrahou.me/projects/shell-agent](https://www.aliaitrahou.me/projects/shell-agent).
