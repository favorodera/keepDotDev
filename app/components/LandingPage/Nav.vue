<template>
  <nav class="sticky -top-1 z-10 p-4 w-full border-b border-default bg-default">

    <ul class="flex justify-between items-center mx-auto w-full max-w-8xl">

      <li>
        <ULink to="/">
          <Logo />
        </ULink>
      </li>


      <li>
        <UButton
          label="Login"
          variant="solid"
          icon="lucide:lock"
          to="/auth"
        />
      </li>

    </ul>

  </nav>

</template>
