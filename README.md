# Message-Go

A tiny tool to automatically collect messages in source file and transfer them into message properties file

## Why Message-Go

In SF's project, i18n is an important thing we should take care of as an engineer. Commonly, these static messages should be put in the *sfmessages-MODULE.properties.utf8*.

Problems here!

> When you (as an UI developer) develop a new feature for some au module, you have to put the new messages in the *sfmessages-MODULE.properties.utf8* file which is located in V4.
Then it is required to REBUILD v4 and REDEPLOY your module to get the new messages. As shown in the following chart, the process is really crappy:

      +---------------------+
      | add/change messages |<--------+
      | in sfmessages-MO... |         |
      +---------------------+         |
                +                     |
                |                     |
                v                     |
      +---------------------+         |
      |     rebuild V4      |         |
      +---------------------+         |
                +                     |
                |                     |
                v                     |
      +---------------------+         |
      |  redeploy au module |         |
      +---------------------+         |
                +                     |
                |                     |
                v                     |
      +---------------------+         |
      |  Need more changes  |+--------+
      +---------------------+

So, here comes Message-Go, Message-Go gives you a more efficient way to add new messages, as described in the following:

1. You just add messages in your source file(like new-feature.js) anyway(At the top of the source file is recommended), like

    MSGS.HOMEPAGE_ADMIN_LABEL_SHOW='show';
    MSGS.HOMEPAGE_ADMIN_LABEL_HIDE='hide';
    ....

    // use the message in the same way as in production
    html.push(MSGS.HOMEPAGE_ADMIN_LABEL_SHOW);
    ...

2. Message-Go will *COLLECT* all the messages in your source file(or directory) , put them into *sfmessages-MODULE.properties.utf8* automatically after your confirmed you don't wanna change them any more and run Message-Go.

The following chart shows the advantage to use Message-Go compared with the common way:

    
            OLD PROCESS                     WITH MESSAGE-GO
          ---------------                  -----------------

      +---------------------+          +------------------------+
      | add/change messages |<--+      | add/change messages in |<--+
      | in sfmessages-MO... |   |      | source file directly   |   |
      +---------------------+   |      +------------------------+   |
                +               |                  +                |
                |               |                  |                |
                v               |                  v                |
      +---------------------+   |      +------------------------+   |
      |     rebuild V4      |   |      |        deploy-js       |   |
      +---------------------+   |      +------------------------+   |
                +               |                  +                |
                |               |                  |                |
                v               |                  v                |
      +---------------------+   |      +------------------------+   |
      |  redeploy au module |   |      |    Need more changs    |+--+
      +---------------------+   |      +------------------------+
                +               |                  
                |               |                  
                v               |                  
      +---------------------+   |      
      |  Need more changes  |+--+
      +---------------------+


> As you see, with Message-Go, you don't need to rebuild and redeploy anymore, it will make better powerful if it is used with [NProxy](http://goddyzhao.me/nproxy) and you can say GOODBYE to build system as a UI developer. 

The following chart shows the great powerful from [NProxy](http://goddyzhao.me/nproxy) and Message-Go:


         WITH MESSAGE-GO                  WITH MESSAGE-GO AND NPROXY
        -----------------                ----------------------------

      +------------------------+          +------------------------+
      | add/change messages in |<--+      | add/change messages in |<--+
      | source file directly   |   |      | source file directly   |   |
      +------------------------+   |      +------------------------+   |
                +                  |                  +                |
                |                  |                  |                |
                v                  |                  v                |
      +------------------------+   |      +------------------------+   |
      |      deploy-js         |   |      |    Need more changs    |+--|
      +------------------------+   |      +------------------------+   
                +                  |       
                |                  |       
                v                  |       
      +------------------------+   |     
      |  Need more changs      |+--|   
      +------------------------+       

## Installation

    npm i -g message-go

## Update
    npm update -g message-go

## Usage
    
    mgo -f /Users/goddyzhao/project/js -t /Users/goddyzhao/project/sfmessage.properties
    
Note: -f(from) can be a js file or directory(Message-Go will treat only js file now)
      -t(to) should be a file but not directory

**More Options**
    Usage: mgo [options]
    
    Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -f, --from [from]  Specify a single source file or directory including messages
    -t, --to [to]      Specify the message property file

## License
Message-Go is available under the terms of the MIT License
