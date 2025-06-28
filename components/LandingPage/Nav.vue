<template>
  <nav class="sticky -top-1 z-10 p-4 w-full border-b border-neutral-800 md:p-6 bg-default">

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
          size="lg"
          to="/auth"
        />
      </li>

    </ul>

  </nav>

</template>
