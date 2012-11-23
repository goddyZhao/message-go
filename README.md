# Message-Go

A tiny tool to automatically collect messages in source file and transfer them into message properties file

## Why Message-Go

In SF's project, i18n is an important thing we should take care of as an engineer. Commonly, these static messages should be put in the *sfmessages-MODULE.properties.utf8*.

Problems here!

> When I (as an UI developer) develop a new feature for some au module, I have to put the new messages in the *sfmessages-MODULE.properties.utf8* file which is located in V4.
Then I have to REBUILD v4 and REDEPLOY my module to get the new messages. This crappy process is shown in the following chart:

    +---------------------+
    | add/change messages |<--------+
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


