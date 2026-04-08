# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e5]:
      - img "Busy Left" [ref=e8]
      - generic [ref=e9]:
        - img "Busy Logo" [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - heading "Login" [level=1] [ref=e15]
            - generic [ref=e16]:
              - generic [ref=e17]:
                - generic [ref=e19]:
                  - textbox "Enter your email" [active] [ref=e20]: "6"
                  - button "clear" [ref=e22] [cursor=pointer]:
                    - img [ref=e23]
                  - group
                - paragraph [ref=e25]: Invalid Email
              - button "Continue" [disabled]
          - generic [ref=e26]:
            - separator [ref=e27]:
              - generic [ref=e28]: Or
            - button "Google Icon Continue with Google" [ref=e29] [cursor=pointer]:
              - img "Google Icon" [ref=e31]
              - text: Continue with Google
  - alert [ref=e32]
```